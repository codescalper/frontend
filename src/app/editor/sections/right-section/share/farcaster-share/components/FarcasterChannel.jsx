import React from "react";
import {
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Card,
  Typography,
} from "@material-tailwind/react";
import { InputBox } from "../../../../../common";

const FarcasterChannel = () => {
  const data = [
    {
      id: 1,
      name: "Channel 1",
      logo: "https://cdn.stamp.fyi/avatar/eth:0x0?size=300",
    },
    {
      id: 2,
      name: "Channel 2",
      logo: "https://cdn.stamp.fyi/avatar/eth:0x0?size=300",
    },
  ];
  return (
    <Card className="w-96">
      <List>
        <ListItem>
          <ListItemPrefix>
            <Avatar
              variant="circular"
              alt="candice"
              src="https://docs.material-tailwind.com/img/face-1.jpg"
            />
          </ListItemPrefix>
          <div>
            <Typography variant="h6" color="blue-gray">
              Tania Andrew
            </Typography>
            <Typography variant="small" color="gray" className="font-normal">
              Software Engineer @ Material Tailwind
            </Typography>
          </div>
        </ListItem>
      </List>
    </Card>
  );
};

export default FarcasterChannel;
