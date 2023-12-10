import React, { useContext, useEffect, useState } from "react";
import { LogoutBtn, ProfilePanelHeaders } from "./components";
import iconTrending from "./assets/svgs/iconTrending.svg";
import { Tabs, Tab, TabsHeader } from "@material-tailwind/react";
import { getAllTasks, getInviteCode } from "../../../../../services";
import { useQuery } from "@tanstack/react-query";
import { PowerIcon } from "@heroicons/react/24/outline";
import { useLogout } from "../../../../../hooks/app";
import { toast } from "react-toastify";
import { Context } from "../../../../../providers/context";
import BsGift from "@meronex/icons/bs/BsGift";
import MdcStarFourPointsOutline from "@meronex/icons/mdc/MdcStarFourPointsOutline";
import {
  CardsHeading,
  LensCard,
  TasksCard,
  UserCard,
} from "./components/Cards";
import {
  ComplProfileModal,
  InviteModal,
} from "./components/Modals/blueprintjs";
import XMTP from "./components/integrations/XMTP";

const ProfilePanel = () => {
  const [tasksArr, setTasksArr] = useState([]);
  const [inviteCodesArr, setInviteCodesArr] = useState([]);
  const [selectedTab, setSelectedTab] = useState("tasks");
  const [openedModal, setOpenedModal] = useState("");
  const { userProfileDetails, setUserProfileDetails } = useContext(Context);
  const { logout } = useLogout();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getTasks"],
    queryFn: () => getAllTasks(),
  });

  const fnGetAllInviteCodes = async () => {
    const inviteCodes = await getInviteCode();
    console.log(inviteCodes);
    setInviteCodesArr(inviteCodes?.data?.message);
  };

  const fnGetAllTasks = async () => {
    setTasksArr(data?.data?.message);
  };

  useEffect(() => {
    fnGetAllTasks();
    fnGetAllInviteCodes();
  }, [data]);

  // useEffect(() => {
  //   fnGetAllInviteCodes();
  // });

  return (
    <ProfilePanelHeaders
      // menuName={"share"}
      panelHeader={`Hi @${userProfileDetails?.username || "username"}`}
      panelContent={
        <>
          <div className="flex flex-col align-middle justify-between">
            <UserCard />

            <div className="flex m-2">
              <div className="ml-2 text-base font-semibold"> Invite Codes </div>
              <div className="ml-4 mt-0.5">{inviteCodesArr}</div>
            </div>

            <hr className="mb-2" />

            <CardsHeading name="Trending" iconImg={iconTrending} />
            <LensCard />
            <XMTP />

            <Tabs className="overflow-scroll my-2" value={selectedTab}>
              <TabsHeader className="relative top-0 mx-2 mb-4">
                <Tab
                  value="tasks"
                  className="appFont"
                  onClick={() => setSelectedTab("tasks")}
                >
                  <CardsHeading
                    name="Tasks"
                    icon={<MdcStarFourPointsOutline />}
                  />
                </Tab>

                <Tab
                  value="rewards"
                  className="appFont"
                  onClick={() => setSelectedTab("rewards")}
                >
                  <CardsHeading name="Rewards" icon={<BsGift />} />
                </Tab>
              </TabsHeader>

              {isLoading && (
                <div className="flex justify-center m-8"> Loading... </div>
              )}
              {selectedTab === "tasks" && (
                <>
                  {tasksArr?.map(
                    (task) =>
                      // display only the tasks that are not completed
                      !task?.completed && (
                        <div
                          onClick={() => {
                            setOpenedModal(task?.tag);
                            console.log("openedModal", openedModal);
                          }}
                        >
                          <TasksCard
                            modalName={task?.tag}
                            isCompleted={task?.completed}
                            // CardHead={task?.description.split(/\\n/)[0]}
                            // CardSubHead={task?.description.split(/\\n/)[1]}
                            CardHead={task?.name}
                            CardSubHead={task?.description}
                            NoOfPoints={task?.amount}
                          />
                        </div>
                      )
                  )}
                </>
              )}

              {selectedTab === "rewards" && (
                <>
                  {tasksArr?.map(
                    (task) =>
                      // display only the tasks that are completed
                      task?.completed && (
                        <TasksCard
                          modalName={task?.tag}
                          isCompleted={task?.completed}
                          // onClickFn={}
                          // CardHead={task?.description.split(/\\n/)[0]}
                          // CardSubHead={task?.description.split(/\\n/)[1]}
                          CardHead={task?.name}
                          CardSubHead={task?.description}
                          NoOfPoints={task?.amount}
                        />
                      )
                  )}
                </>
              )}
            </Tabs>
          </div>


          <LogoutBtn />
        </>
      }
    />
  );
};

export default ProfilePanel;
