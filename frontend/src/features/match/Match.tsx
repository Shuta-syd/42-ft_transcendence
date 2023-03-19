import React, {useEffect, useState} from "react";
import useQueryMatches from "../../hooks/match/useWueryMatch";
import { Match } from "../../types/PrismaType"

const Matches = () => {
    const [matchArr, setMatches] = useState<Match[]>([]);
    const [winnerId, setWinnerId] = useState<string>('a');
    const MatchPromises = useQueryMatches();
    useEffect(() => {
        MatchPromises.then((matches: Match[]) => {
            setMatches(matches);
            setWinnerId(matches[matches.length - 1].winner_id);
        });
    }, [MatchPromises]);


    function ShowResult(props: {p1: string, p2: string}) {
        // console.log('winnerId', winnerId);
        if (winnerId === '1') {
            return (
                <h2>
                    <div>
                        Winner
                        &nbsp;=&gt;
                        { props.p1  }!!!
                    </div>
                </h2>
            );
        }
        return (
            <h2>
                <div>
                    Winner
                    &nbsp;=&gt;
                    {  props.p2  }!!!
                </div>
            </h2>
        );
    }

    return (
        <div>
            <h1>[Match Result]</h1>
            {matchArr.map((match) => (
                <div key={match.id}>
                    <h1>[{match.id}]    {match.player1} vs {match.player2}</h1>
                    <div>
                        <ShowResult
                            p1={match.player1}
                            p2={match.player2}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Matches;
