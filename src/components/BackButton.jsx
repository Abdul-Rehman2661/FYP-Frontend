import {ArrowLeftIcon} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate(); 

  return (
    <button
      onClick={() => navigate(-1)} 
      className="absolute lg:top-4 top-2 left-4 p-2 rounded-lg bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
    >
      <ArrowLeftIcon className="h-5 w-5 text-white" />
    </button>
  );
}  