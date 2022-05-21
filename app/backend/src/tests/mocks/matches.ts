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
    inProgress: false,
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
    inProgress: true,
    teamHome: {
      teamName: "Avangers"
    },
    teamAway: {
      teamName: "Justice League"
    }
  },
]

export default MatchesMock;