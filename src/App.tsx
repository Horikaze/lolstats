import { Avatar, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { ArrowBigDown } from "lucide-react";
import { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

type SUMMONERV4 = {
  data: {
    id: string;
    accountId: string;
    puuid: string;
    name: string;
    profileIconId: number;
    revisionDate: number;
    summonerLevel: number;
  };
};

type Participant = {
  puuid: string;
  summonerLevel: number;
  summonerName: string;
  championName: string;
};
const defParticipant: Participant = {
  puuid: "",
  summonerLevel: 0,
  summonerName: "",
  championName: "",
};

type MatchData = {
  metadata: {
    matchId: string;
  };
  info: {
    gameDuration: number;
    participants: Participant[];
  };
};

function App() {
  const [userName, setUserName] = useState<string>("");
  const [summData, setSummData] = useState<SUMMONERV4 | null>(null);
  const [latestMatches, setLatestMatches] = useState<MatchData[]>([]);
  const getSummonerData = async () => {
    const data = (await axios.get(
      `https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${userName}?api_key=${
        import.meta.env.VITE_RIOT_API
      }`
    )) as SUMMONERV4;
    setSummData(data);
  };

  const getLatestMatches = async () => {
    try {
      const matches = [];
      const response = await axios.get(
        `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${
          summData?.data.puuid
        }/ids?start=0&count=20&api_key=${import.meta.env.VITE_RIOT_API}`
      );
      const data = response.data;

      for (const matchId of data) {
        const matchResponse = await axios.get(
          `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${
            import.meta.env.VITE_RIOT_API
          }`
        );
        const matchData = matchResponse.data;
        matches.push(matchData);
      }
      console.log(matches);
      setLatestMatches(matches); // Assuming setLatestMatches is a valid function for setting state
    } catch (error) {
      console.error("Error fetching latest matches:", error);
    }
  };

  return (
    <div className="flex flex-col mt-2 pl-2">
      <div className="flex justify-center">
        <div className="flex max-w-sm space-x-2 justify-center">
          <Input
            placeholder="Summoner name"
            type="text"
            onChange={(e) => setUserName(e.target.value)}
          />
          <Button onClick={() => getSummonerData()}>Get data</Button>
          <Button onClick={() => getLatestMatches()}>Get Matches</Button>
        </div>
      </div>
      <div className="flex flex-col">
        <Avatar>
          <AvatarImage
            src={
              summData?.data
                ? `https://dlied1.qq.com/lolapp/lol/summoner/profileicon/${summData?.data.profileIconId}.jpg`
                : `https://dlied1.qq.com/lolapp/lol/summoner/profileicon/0.jpg`
            }
          />
        </Avatar>
        <p className="font-bold">
          Name:{" "}
          <span className="font-semibold text-blue-700">
            {summData?.data.name}
          </span>
        </p>
        <p className="font-bold">
          Profile Icon Id:{" "}
          <span className="font-semibold text-blue-700">
            {summData?.data.profileIconId}
          </span>
        </p>
        <p className="font-bold">
          Puuid:{" "}
          <span className="font-semibold text-blue-700">
            {summData?.data.puuid}
          </span>
        </p>
        <p className="font-bold">
          Summoner Level:{" "}
          <span className="font-semibold text-blue-700">
            {summData?.data.summonerLevel}
          </span>
        </p>
        <div className="flex flex-col text-center">
          <h2 className="font-bold text-2xl"> Latest Matches</h2>
          {latestMatches.length > 0
            ? latestMatches?.map((match) => {
                const currPar: Participant =
                  match.info.participants.find(
                    (ele) => ele.puuid === summData?.data.puuid
                  ) || defParticipant;

                const time = new Date(match.info.gameDuration * 1000)
                  .toISOString()
                  .slice(11, 19)
                  .substring(1);
                return (
                  <div
                    key={match.metadata.matchId}
                    className="flex flex-col max-w-sm pt-5"
                  >
                    <div className="p-2 rounded-md border-2 border-slate-500 mx-2">
                      <div className="flex flex-row justify-between">
                        <div className="text-sm">
                          <p>Game ID: {match.metadata.matchId}</p>
                        </div>
                        <ArrowBigDown className="w-6 h-6 place-self-end text-slate-600 cursor-pointer hover:bg-slate-400 transition rounded-md hover:text-white" />
                      </div>
                      <div className="flex flex-row justify-between gap-y-2">
                        <p>
                          <span className="font-semibold">Time:</span> {time}
                        </p>
                        <p>
                          <span className="font-semibold">Champion:</span>{" "}
                          {currPar.championName}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            : null}
        </div>
      </div>
    </div>
  );
}

export default App;
