import React, { useContext, useEffect, useState } from "react";
import { Dialog, DialogBody, DialogFooter } from "@blueprintjs/core";
import { Input, Button, Typography } from "@material-tailwind/react";
import BsX from "@meronex/icons/bs/BsX";
import { Context } from "../../../../../../../../providers/context";
import {
  getProfileImage,
  getTop5SocialDetails,
} from "../../../../../../../../services";
import { useAccount, useWalletClient } from "wagmi";
import { Top5ProfileCard } from "../../Cards";

// XMTP
import { Client } from "@xmtp/xmtp-js";

const InviteModal = () => {
  const { address } = useAccount();
  const { openedProfileModal, setOpenedProfileModal } = useContext(Context);
  const [formData, setFormData] = useState({});
  const [top5Users, setTop5Users] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data: walletClient } = useWalletClient();
  const [xmtpSendAddr, setXmtpSendAddr] = useState("");

  const XMTPfn = async () => {
    const xmtp = await Client.create(walletClient, { env: "dev" });

    // Start a conversation with XMTP
    const conversation = await xmtp.conversations.newConversation(
      "0x983d6466FAC5B2aFe57e070283a4932A1bd0508F"
    );

    // Send a message
    await conversation.send("gm");
  };

  const userAddresses = [];
  const userProfileNames = [];
  const userProfileImages = [];

  const fnGetTop5Interactions = async () => {
    setLoading(true);
    const res = await getTop5SocialDetails({
      address: ["0x983d6466FAC5B2aFe57e070283a4932A1bd0508F"],
    });

    // console.log(res);
    // res?.SocialFollowers?.Follower[0].followerAddress.socials[0].userAssociatedAddresses[0]

    if (res && res.SocialFollowers && res.SocialFollowers.Follower) {
      res.SocialFollowers.Follower.forEach((follower) => {
        if (follower.followerAddress && follower.followerAddress.socials) {
          follower.followerAddress.socials.forEach((social) => {
            if (social.userAssociatedAddresses && social.dappName === "lens") {
              userProfileNames.push(social.profileName);
              userAddresses.push(social.userAssociatedAddresses[0]);

              if (social.profileImageContentValue?.image === null) {
                userProfileImages.push("");
              } else {
                userProfileImages.push(
                  social?.profileImageContentValue?.image?.small
                );
              }
            }
          });
        }
      });
    }

    const users = userAddresses.map((address, index) => ({
      userAddress: address,
      userProfileName: userProfileNames[index] || "username", // Default username
      userProfileImage: userProfileImages[index] || "", // Default empty
    }));

    if (users.length > 5) users.splice(5, users.length - 5);
    setTop5Users(users);
    console.log(users);

    setLoading(false);
  };

  useEffect(() => {
    fnGetTop5Interactions();
  }, []);

  return (
    <>
      <Dialog
        className=" w-4/6"
        isOpen={openedProfileModal}
        canEscapeKeyClose="true"
        canOutsideClickClose="true"
      >
        <DialogBody className="m-2 p-2">
          <div className="flex justify-between">
            <Typography className="mb-4" variant="h4">
              Invite a friend
            </Typography>

            <BsX
              size="24"
              className="cursor-pointer mt-1"
              onClick={() => setOpenedProfileModal(!openedProfileModal)}
            />
          </div>

          {/* <div className="mt-2 mb-2">
            {" "}
            Choose a friend or input a Wallet Address to share an Invite{" "}
          </div> */}

          <div className="m-2 mt-4 w-fit bg-gray-200 p-1 pl-4 pr-4 rounded-full">
            {" "}
            Recommended friends based on your onchain activity {""}
          </div>

          {loading && (
            <div className="flex justify-center m-8"> Loading... </div>
          )}

          {!loading && (
            <div className="flex flex-wrap">
              {top5Users.map((user, index) => (
                <Top5ProfileCard
                  profileAddress={user.userAddress}
                  profileName={user.userProfileName.split("lens/")[1]}
                  profileImg={user.userProfileImage}
                />
              ))}
            </div>
          )}
          <div className="flex justify-center m-8"> -- OR -- </div>

          <div className="mt-2">
            <Input label="Wallet Address" name="xmtpSendAddr" />
          </div>

          <div className="mt-4 text-right">
            <Button
              onClick={XMTPfn}
              color="indigo"
              // size="sm"
            >
              {" "}
              Confirm{" "}
            </Button>
          </div>
        </DialogBody>
      </Dialog>
    </>
  );
};

export default InviteModal;
