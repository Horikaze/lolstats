import axios from "axios";
import { ArrowBigDown } from "lucide-react";
import { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

function App() {
  const [userName, setUserName] = useState<string>("");
  const [summData, setSummData] = useState<SUMMONERV4 | null>(null);
  const [latestMatches, setLatestMatches] = useState<string[]>([""]);
  const getSummonerData = async () => {
    const data = (await axios.get(
      `https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${userName}?api_key=RGAPI-1e91dce5-b72d-4e3d-93fd-59dd870c997c`
    )) as SUMMONERV4;
    setSummData(data);
  };

  const getLatestMatches = async () => {
    const data = await axios.get(
      `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${summData?.data.puuid}/ids?start=0&count=20&api_key=RGAPI-1e91dce5-b72d-4e3d-93fd-59dd870c997c`
    );
    setLatestMatches(data.data);
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
          <AvatarFallback>PI</AvatarFallback>
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
          {latestMatches?.map((match) => (
            <div key={match} className="flex flex-col max-w-sm pt-5">
              <div className="p-2 rounded-md border-2 border-slate-500  mx-2">
                <div className="flex flex-row justify-between">
                  <div className="text-sm">
                    <p>{match}</p>
                  </div>
                  <ArrowBigDown className="w-6 h-6 place-self-end text-slate-600 cursor-pointer hover:bg-slate-400 transition rounded-md hover:text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
