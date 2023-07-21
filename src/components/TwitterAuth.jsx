import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../services/localStorage";
import { Context } from "../context/ContextProvider";
import { ToastContainer, toast } from "react-toastify";
import { twitterAuthenticateCallback } from "../services/backendApi";
import { Spinner } from "@blueprintjs/core";

const TwitterAuth = () => {
  const navigate = useNavigate();
  const getTwitterAuth = getFromLocalStorage("twitterAuth");
  const { setIsLoading, setText, isLoading, text } = useContext(Context);

  // twitter auth start
  const twitterCallback = async (state, code) => {
    if (getTwitterAuth) return;
    setIsLoading(true);
    const res = await twitterAuthenticateCallback(state, code);
    if (res?.data) {
      saveToLocalStorage("twitterAuth", true);
      setIsLoading(false);
      toast.success("Successfully authenticated");
      setTimeout(() => {
        navigate("/");
      }, 6000);
      return;
    } else if (res?.error) {
      toast.error(res?.error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");

    console.log("state", state);
    console.log("code", code);

    twitterCallback(state, code);
  }, []);
  // twitter auth end

  return (
    <>
      {/* {isLoading && <LoadingComponent text={text} />} */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div
        className="flex justify-center items-center h-screen"
        style={{
          background: "linear-gradient(90deg, #E598D8 0%, #E1F16B 100%)",
        }}
      >
        <div className="md:w-3/4 lg:w-1/2">
          <div className="flex flex-col justify-between m-2 p-2">
            <div className="flex flex-col justify-center text-center flex-wrap m-4 rounded-md">
              <div className="m-2 text-lg">
                {" "}
                <img
                  className="h-16"
                  src="/LenspostAlphaLogoRemovedBG.png"
                  alt=""
                />{" "}
                {isLoading && <Spinner />}
              </div>
              {/* if wallet is disconnected */}
              {/* <div className="mb-2 p-2 flex flex-row justify-center">
                <button
                  disabled={isLoading}
                  onClick={() => navigate("/")}
                  className="bg-blue-500 py-3 px-5 rounded-lg text-white"
                >
                  Back to Home
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TwitterAuth;
