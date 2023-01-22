pragma solidity 0.4.25;

contract Election {
    // Model a Candidate
    struct Candidate {
        uint256 id;
        string name;
        string partyname;
        uint256 voteCount;
    }

    // Store accounts that have voted
    mapping(address => bool) public voters;
    // Store Candidates
    // Fetch Candidate
    mapping(uint256 => Candidate) public candidates;
    // Store Candidates Count
    uint256 public candidatesCount;

    // voted event
    event votedEvent(uint256 indexed _candidateId);

    constructor() public {}

    function addCandidate(string _name, string _partyname) public {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(
            candidatesCount,
            _name,
            _partyname,
            0
        );
    }

    function vote(uint256 _candidateId) public {
        // require that they haven't voted before
        require(!voters[msg.sender]);

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // record that voter has voted
        voters[msg.sender] = true;

        // update candidate vote Count
        candidates[_candidateId].voteCount++;

        // trigger voted event
        emit votedEvent(_candidateId);
    }

    /// generating results
    function getWinner() public view returns (string winner) {
        uint256 maxNumberOfVotes;
        //  string winner;
        //uint length = candidates.length;
        for (uint256 i = 0; i <= candidatesCount; i++) {
            if (candidates[i].voteCount > maxNumberOfVotes) {
                maxNumberOfVotes = candidates[i].voteCount;
                //winner =i;
                winner = candidates[i].name;
            }
        }
    }
}
