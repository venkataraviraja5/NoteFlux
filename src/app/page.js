import Image from "next/image";
import VoiceText from "../components/VoiceText"
import AskQuestion from '../components/Question'

export default function Home() {
  return (
    <main className="flex  flex-col items-center justify-between pt-10 ">
    <VoiceText/>
<AskQuestion/>
    
    </main>
  );
}
