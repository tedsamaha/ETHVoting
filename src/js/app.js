App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
      ethereum.enable();
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider(
        'http://localhost:7545'
      );
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function () {
    $.getJSON('Election.json', function (election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function () {
    App.contracts.Election.deployed().then(function (instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance
        .votedEvent(
          {},
          {
            fromBlock: 'latest', // changing this due to mutilple renders
            toBlock: 'latest',
          }
        )
        .watch(function (error, event) {
          console.log('event triggered', event);
          // Reload when a new vote is recorded
          App.render();
        });
    });
  },
  ////////////////////////////////////////////////////////////////// smj agya hai
  render: function () {
    var electionInstance;
    var loader = $('#loader');
    var content = $('#content');

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function (err, account) {
      // it shows that miners are getting reward for for generating ou new block
      if (err === null) {
        App.account = account;
        $('#accountAddress').html('Your Account: ' + account);
      }
    });
    //////////////////////////////////////////////////////////////////////////////////////////
    // Load contract data
    App.contracts.Election.deployed()
      .then(function (instance) {
        electionInstance = instance;
        return electionInstance.candidatesCount();
      })
      .then(function (candidatesCount) {
        var candidatesResults = $('#candidatesResults');
        candidatesResults.empty();

        var candidatesSelect = $('#candidatesSelect');
        candidatesSelect.empty();

        for (var i = 1; i <= candidatesCount; i++) {
          electionInstance.candidates(i).then(function (candidate) {
            var id = candidate[0];
            var name = candidate[1];
            var partyname = candidate[2];
            var voteCount = candidate[3];

            // Render candidate Result
            var candidateTemplate =
              '<tr><th>' +
              id +
              '</th><td>' +
              name +
              '</td><td>' +
              partyname +
              '</th><td>' +
              voteCount +
              '</td></tr>';
            candidatesResults.append(candidateTemplate);

            // Render candidate ballot option
            var candidateOption =
              "<option value='" +
              id +
              "' >" +
              name +
              ' ' +
              partyname +
              '</ option>';
            candidatesSelect.append(candidateOption);
          });
        }
        return electionInstance.voters(App.account);
      })
      .then(function (hasVoted) {
        // Do not allow a user to vote
        if (hasVoted) {
          $('form').hide();
        }
        loader.hide();
        content.show();
      })
      .catch(function (error) {
        console.warn(error);
      });
  },

  castVote: function () {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed()
      .then(function (instance) {
        return instance.vote(candidateId, { from: App.account });
      })
      .then(function (result) {
        // Wait for votes to update
        $('#content').hide();
        $('#loader').show();
      })
      .catch(function (err) {
        console.error(err);
      });
  },
};
////////////////////////////////---------- panga  /// kamyabbb /////

function addthis() {
  var candidateadd = $('#ccaa').val();
  var candidatepartyadd = $('#cca').val();

  if (candidateadd && candidatepartyadd) {
    App.contracts.Election.deployed()
      .then(function (instance) {
        return instance.addCandidate(candidateadd, candidatepartyadd, {
          from: App.account,
        });
      })
      .then(function (result) {
        window.alert('Candidate added');
        location.reload();
        // $("#content").hide();
        // $("#loader").show();
      })
      .catch(function (err) {
        console.error(err);
      });
    // add refresher
  } else {
    window.alert('One or more fields are empty');
  }
}

///////////------- announce winner
function announceWinner() {
  ///////////////// ye b done ///////////////
  App.contracts.Election.deployed()
    .then(function (instance) {
      return instance.getWinner({ from: App.account });
    })
    .then(function (result) {
      window.alert('Winner is ' + result);
      // document.getElementById('winnerP').innerHTML = result;
    })
    .catch(function (err) {
      console.error(err);
    });
}

//// voter winner function
function announceWinneratVoter() {
  /////////////

  var db = firebase.firestore();
  var docRef = db.collection('electionstatus').doc('GZfNxyDWkg0RTS9Z2Wya');

  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        //   console.log("Document data:", doc.data());
        var val = doc.data().value;

        var val = val.toString();
        // console.log(val);
        if (val == 0) {
          /////////////
          App.contracts.Election.deployed()
            .then(function (instance) {
              return instance.getWinner({ from: App.account });
            })
            .then(function (result) {
              window.alert('Winner is ' + result);
              // document.getElementById('winnerP').innerHTML = result;
            })
            .catch(function (err) {
              console.error(err);
            });
          /////////////
        } else {
          // doc.data() will be undefined in this case
          window.alert('Election are still in progress');
        }
      } else {
        // doc.data() will be undefined in this case
        window.alert('Election are still in progress');
      }
    })
    .catch((error) => {
      console.log('Error getting document:', error);
    });
}

/////////////

//////////////////////////////---------------

$(function () {
  $(window).load(function () {
    App.init();
  });
});