import { IMatch } from '../../interface';

interface fullMatch extends IMatch {
  teamHome: {
    teamName: string,
  }
  teamAway: {
    teamName: string,
  }
}

const MatchesMock: fullMatch[] = [
  {
    id: 1,
    homeTeam: 1,
    homeTeamGoals: 7,
    awayTeam: 2,
    awayTeamGoals: 1,
    inProgress: true,
    teamHome: {
      teamName: "Justice League"
    },
    teamAway: {
      teamName: "Avangers"
    }
  },
  {
    id: 2,
    homeTeam: 2,
    homeTeamGoals: 1,
    awayTeam: 1,
    awayTeamGoals: 7,
    inProgress: false,
    teamHome: {
      teamName: "Avangers"
    },
    teamAway: {
      teamName: "Justice League"
    }
  },
  {
    id: 3,
    homeTeam: 2,
    homeTeamGoals: 3,
    awayTeam: 1,
    awayTeamGoals: 2,
    inProgress: false,
    teamHome: {
      teamName: "Avangers"
    },
    teamAway: {
      teamName: "Justice League"
    }
  },
  {
    id: 4,
    homeTeam: 2,
    homeTeamGoals: 7,
    awayTeam: 1,
    awayTeamGoals: 7,
    inProgress: false,
    teamHome: {
      teamName: "Avangers"
    },
    teamAway: {
      teamName: "Justice League"
    }
  },
  {
    id: 5,
    homeTeam: 1,
    homeTeamGoals: 3,
    awayTeam: 2,
    awayTeamGoals: 5,
    inProgress: false,
    teamHome: {
      teamName: "Justice League"
    },
    teamAway: {
      teamName: "Avangers"
    }
  },
  {
    id: 6,
    homeTeam: 1,
    homeTeamGoals: 11,
    awayTeam: 2,
    awayTeamGoals: 11,
    inProgress: false,
    teamHome: {
      teamName: "Justice League"
    },
    teamAway: {
      teamName: "Avangers"
    }
  },
  {
    id: 7,
    homeTeam: 1,
    homeTeamGoals: 15,
    awayTeam: 2,
    awayTeamGoals: 13,
    inProgress: false,
    teamHome: {
      teamName: "Justice League"
    },
    teamAway: {
      teamName: "Avangers"
    }
  },
]

export default MatchesMock;