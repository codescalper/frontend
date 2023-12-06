import React, { useState } from "react";
import {
  CardsHeading,
  LensCard,
  ProfilePanelHeaders,
  TasksCard,
  UserCard,
} from "./components";
import iconTasks from "./assets/svgs/iconTasks.svg";
import iconTrending from "./assets/svgs/iconTrending.svg";

const ProfilePanel = () => {

  return (
    <ProfilePanelHeaders
      // menuName={"share"}
      panelHeader={"Hi @username"}
      panelContent={
        <>
          <div className="flex flex-col align-middle justify-between">
            <UserCard />

            <CardsHeading name="Trending" icon={iconTrending} />
            <LensCard />

            <CardsHeading name="Tasks" icon={iconTasks} />
            <TasksCard
              // onClickFn={}
              modalName="profile"
              CardHead="Complete your Profile"
              CardSubHead="Earn extra points by completing your profile"
              NoOfPoints="10"
            />
            <TasksCard
              // onClickFn={}
              modalName="invite"
              CardHead="Invite a friend"
              CardSubHead="Invite a friend to join Lenspost and earn 10 points"
              NoOfPoints="10"
            />
          </div>

        </>
      }
    />
  );
};

export default ProfilePanel;
