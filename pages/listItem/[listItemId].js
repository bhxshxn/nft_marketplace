import React from "react";
import { useRouter } from "next/router";
import {
  useAddress,
  useMarketplace,
  useNFTs,
  useContract,
  useMetamask,
  useSigner,
  useNFTCollection,
} from "@thirdweb-dev/react";
import {
  Marketplace,
  NATIVE_TOKEN_ADDRESS,
  TransactionResult,
} from "@thirdweb-dev/sdk";
import Header from "../../components/Header";
import toast, { Toaster } from "react-hot-toast";
import { useRef, useState } from "react";

const style = {
  Wrapper: `flex flex-col justify-top items-center h-screen w-screen bg-[#3b3d42] `,
  button: `border border-[#282b2f] bg-[#2081e2] p-[0.8rem] text-xl font-semibold rounded-lg cursor-pointer text-black`,
  details: `text-lg text-center text=[#282b2f] font-semibold mt-4`,
  form: ` flex flex-col justify-center items-left py-[50px]`,
};

const listItem = () => {
  const connectUsingMetamask = useMetamask();
  const address = useAddress();
  const router = useRouter();
  const selectedNft = router.query;
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const marketplace = useMarketplace(
    "0xE073aAbD1E166Aa23d9562b9D4aB62b57Da9dE9e"
  );
  // const contract = useContract(process.env.MARKETPLACE_ADDRESS);
  const onSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);
    try {
      const transaction = await marketplace?.direct.createListing({
        assetContractAddress: process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS, // Contract Address of the NFT
        buyoutPricePerToken: price, // Maximum price, the auction will end immediately if a user pays this price.
        currencyContractAddress: NATIVE_TOKEN_ADDRESS, // NATIVE_TOKEN_ADDRESS is the crpyto curency that is native to the network. i.e. Rinkeby ETH.
        listingDurationInSeconds: 60 * 60 * 24 * 7, // When the auction will be closed and no longer accept bids (1 Week)
        quantity: 1, // How many of the NFTs are being listed (useful for ERC 1155 tokens)
        startTimestamp: new Date(0), // When the listing will start
        tokenId: router.query.listItemId, // Token ID of the NFT.
      });

      console.log(transaction);
    } catch (error) {
      console.error(error);
    }
    // console.log(id);
    // confirmMint();
    // setDescription("");
    // setImage("");
    // setName("");
    // setLoading(false);
  };
  const confirmMint = (toastHandler = toast) =>
    toastHandler.success(`Minting successful!`, {
      style: {
        background: "#04111d",
        color: "#fff",
      },
    });
  return (
    <>
      <Header />
      <div className={style.Wrapper}>
        <Toaster position='top-center' reverseOrder={false} />
        {address ? (
          <>
            {loading ? (
              <Loading />
            ) : (
              <div>
                <form className={style.form} onSubmit={onSubmit}>
                  <div className='py-[15px] flex justify-between'>
                    Price:
                    <input
                      type='text'
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className='rounded-[5px]'
                    />
                  </div>
                  <div className='w-[100%] flex justify-center '>
                    <div className='rounded-[5px] w-[50%] flex justify-center py-[5px] bg-[#0062ff]'>
                      <button type='submit' disabled={loading}>
                        List NFT
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </>
        ) : (
          <button onClick={connectUsingMetamask}>Connect using Metamask</button>
        )}
      </div>
    </>
  );
};

export default listItem;
