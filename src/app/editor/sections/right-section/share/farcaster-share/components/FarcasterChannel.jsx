import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Card,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { InputBox } from "../../../../../common";
import BiSearchAlt2 from "@meronex/icons/bi/BiSearchAlt2";
import { searchChannelFar } from "../../../../../../../services/apis/BE-apis";
import { useMutation } from "@tanstack/react-query";
import FaRegDotCircle from "@meronex/icons/fa/FaRegDotCircle";
import { useContext } from "react";
import { Context } from "../../../../../../../providers/context";

const FarcasterChannel = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const { farcasterStates, setFarcasterStates } = useContext(Context);
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);

  const { mutateAsync, isError, error } = useMutation({
    mutationKey: "searchChannel",
    mutationFn: searchChannelFar,
  });

  const searchChannel = async () => {
    if (!query) return;

    mutateAsync(query)
      .then((res) => {
        setData(res?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div
        className="relative flex w-full max-w-[24rem]"
        onFocus={() => setOpen(true)}
        // onBlur={() => setOpen(false)}
      >
        <InputBox
          label="Search channel"
          onChange={(e) => setQuery(e.target.value)}
        />
        <IconButton
          size="sm"
          color="blue-gray"
          className="!absolute right-1 top-1 rounded-md outline-none text-white"
          onClick={searchChannel}
        >
          <BiSearchAlt2 />
        </IconButton>
      </div>

      {open && (
        <Card>
          {data?.length > 0 &&
            data.map((item) => (
              <List key={item?.id}>
                <ListItem
                  onClick={() => {
                    setFarcasterStates({
                      ...farcasterStates,
                      channel: item,
                    });
                    setOpen(false);
                  }}
                >
                  <ListItemPrefix>
                    <Avatar
                      variant="circular"
                      alt="candice"
                      src={item?.image_url}
                      className="w-10 h-10"
                    />
                  </ListItemPrefix>
                  <div>
                    <Typography variant="h6" color="blue-gray">
                      {item?.name}
                    </Typography>
                  </div>
                </ListItem>
              </List>
            ))}
        </Card>
      )}

      {farcasterStates.channel && (
        <Card className="mt-2">
          <List>
            <ListItem>
              <div className="w-full flex justify-between items-center">
                <div className="flex items-center">
                  <ListItemPrefix>
                    <Avatar
                      variant="circular"
                      alt="candice"
                      src={farcasterStates.channel?.image_url}
                      className="w-10 h-10"
                    />
                  </ListItemPrefix>

                  <Typography variant="h6" color="blue-gray">
                    {farcasterStates.channel?.name}
                  </Typography>
                </div>

                <div className="flex items-center gap-2">
                  {/* <Typography variant="h6" color="blue-gray">
                  Selected
                </Typography> */}
                  <FaRegDotCircle className="text-green-500" />
                </div>
              </div>
            </ListItem>
          </List>
        </Card>
      )}
    </>
  );
};

export default FarcasterChannel;
