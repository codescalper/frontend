import { NFTContractAddress } from "./NFTCredentials";
import { ConnectButton } from "@rainbow-me/rainbowkit";


const LoginComp = () => {

  return( 
  <div className="flex flex-col align-middle justify-center h-screen" style={{"background" : "linear-gradient(90deg, #E598D8 0%, #E1F16B 100%)" }}>

  <div className="" >
  <div className="flex flex-col align-middle justify-between m-2 p-2">
    <div className="flex flex-col justify-center align-middle text-center flex-wrap m-4 rounded-md"> 
      <div className="m-2 text-lg"> <a href="/"> <img className="h-16" src="/LenspostAlphaLogoRemovedBG.png" alt="" /> </a> </div>
      <div className="m-2 text-lg"> This is a tokengated site, you can only access it if have an NFT from the contract </div>
      <div className="mb-2 text-lg gradText">{NFTContractAddress}</div>
      <div className="mb-2 p-2 flex flex-row justify-center">{ <ConnectButton/> }</div>

      <div className="">
      </div>
    </div>
    </div>
  </div>
  </div>
)};
export default LoginComp;