import React, {useEffect, useState} from "react";
import useQueryMatches from "../../hooks/match/useWueryMatch";
import { Match } from "../../types/PrismaType"

const Matches = () => {
    const [mathcarr, setMatches] = useState<Match[]>([]);
    const MatchPromises = useQueryMatches();
    useEffect(() => {
        MatchPromises.then((matches: Match[]) => {
                setMatches(matches);
        });
    }, [MatchPromises]);

    return (
        <div>
            <h1>[Match Result]</h1>
                {mathcarr.map((match) => (
                    <div key={match.id}>
                        <h2>[{match.id}]    {match.player1} vs {match.player2}</h2>
                        <h2>winner id: {match.winner_id}</h2>
                    </div>
                ))}
        </div>
        )
}

export default Matches;
