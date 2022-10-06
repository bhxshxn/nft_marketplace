import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  useAddress,
  useMarketplace,
  useNFTs,
  useContract,
} from "@thirdweb-dev/react";
import { HiTag } from "react-icons/hi";
import { IoMdWallet } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";
import Loading from "../Loading";

const style = {
  button: `mr-8 flex items-center py-2 px-12 rounded-lg cursor-pointer`,
  buttonIcon: `text-xl`,
  buttonText: `ml-2 text-lg font-semibold`,
};

const MakeOffer = ({ isListed, selectedNft, listings }) => {
  const address = useAddress();
  const [selectedMarketNft, setSelectedMarketNft] = useState();
  const [enableButton, setEnableButton] = useState(false);
  const [loading, setLoading] = useState(false);
  // console.log(selectedNft);
  const router = useRouter();
  useEffect(() => {
    if (!listings || isListed === "false") return;
    (async () => {
      setSelectedMarketNft(
        listings.find(
          (marketNft) =>
            Number(marketNft?.asset.id._hex) ===
            Number(selectedNft.metadata.id._hex)
        )
      );
    })();
  }, [selectedNft, listings, isListed]);

  useEffect(() => {
    if (!selectedMarketNft || !selectedNft) return;

    setEnableButton(true);
  }, [selectedMarketNft, selectedNft]);
  const confirmPurchase = (toastHandler = toast) =>
    toastHandler.success(`Purchase successful!`, {
      style: {
        background: "#04111d",
        color: "#fff",
      },
    });

  // const buyItem = async (
  //   listingId = selectedMarketNft.id,
  //   quantityDesired = selectedMarketNft.quantity,
  //   module = marketPlaceModule
  // ) => {
  //   console.log(listingId, quantityDesired, module, "david");
  //   // yo RAZA lets goooo!!!
  //   //yo Qazi, ok
  //   // sure okay about to run it...
  //   // just clicked buy now...
  //   // still error
  //   // where can i see the contract address of the marketplace module
  //   // in [nftId.js]
  //   await module
  //     .buyoutDirectListing({
  //       listingId: listingId,
  //       quantityDesired: 1,
  //     })
  //     .catch((error) => console.error(error));

  // };
  const marketplace = useMarketplace(
    "0xE073aAbD1E166Aa23d9562b9D4aB62b57Da9dE9e"
  );

  const buyItem = async (id) => {
    try {
      setLoading(true);
      await marketplace.buyoutListing(id, 1);
      confirmPurchase();
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Error purchasing asset");
    }
  };
  if (loading) return <Loading />;
  return (
    <div className='flex h-20 w-full items-center rounded-lg border border-[#151c22] bg-[#303339] px-12'>
      <Toaster position='top-center' reverseOrder={false} />
      {isListed === "true" ? (
        <>
          <div
            onClick={() => {
              enableButton ? buyItem(selectedMarketNft.id, 1) : null;
            }}
            className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}
          >
            <IoMdWallet className={style.buttonIcon} />
            <div className={style.buttonText}>Buy Now</div>
          </div>
          <div
            className={`${style.button} border border-[#151c22]  bg-[#363840] hover:bg-[#4c505c]`}
          >
            <HiTag className={style.buttonIcon} />
            <div className={style.buttonText}>Make Offer</div>
          </div>
        </>
      ) : (
        <>
          {selectedNft?.owner == address ? (
            <div
              onClick={() => {
                router.push({
                  pathname: `/listItem/${Number(selectedNft.metadata.id._hex)}`,
                  query: selectedNft,
                });
              }}
              className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}
            >
              <IoMdWallet className={style.buttonIcon} />
              <div className={style.buttonText}>List Item</div>
            </div>
          ) : (
            <>Not Listed</>
          )}
        </>
      )}
    </div>
  );
};

export default MakeOffer;
