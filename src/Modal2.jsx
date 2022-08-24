import "./profile.css";
import { useAuthValue } from "./AuthContext";
import { signOut } from "firebase/auth";
import { auth, database } from "./firebase";
import { useEffect, useState } from "react";

import { storage } from "./firebase";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";

import ReactAudioPlayer from "react-audio-player";
import { onValue, ref as databaseRef } from "firebase/database";
import Chart, { PieChart } from "./Chart";
import home from "./assets/home.png";
import { Link } from "react-router-dom";
import RecordMe from "./RecorderMe";
import { Recorder } from "react-voice-recorder";
import "react-voice-recorder/dist/index.css";
import "./recorder.css";

function Modal2() {
  const [file, setFile] = useState("");

  const [loader2, setLoader2] = useState(false);
  const [stop, setStop] = useState(false);
  const [clear, setClear] = useState(false);
  const [url, setURL] = useState("");
  const [showData, setShowData] = useState([]);
  const [myData, setmyData] = useState({ file: null, filename: null });

  function handleChange(event) {
    setFile(event.target.files[0]);
    setmyData({ ...myData, file: event.target.files[0] });
  }

  const openModal = function () {
    const modal = document.querySelector(".modal");
    const overlay = document.querySelector(".overlay2");

    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
  };

  const openFileModal = function () {
    const modal = document.querySelector(".fileModal");
    const overlay = document.querySelector(".overlay3");

    overlay.classList.remove("hidden");
    modal.classList.remove("hidden");
  };

  const openUserModal = function () {
    const modal = document.querySelector(".userModal");
    const overlay = document.querySelector(".overlay");

    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
  };

  const openAnalyzeModal = function () {
    const modal = document.querySelector(".analyzeModal");
    const overlay = document.querySelector(".overlay4");

    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
  };

  const closeModal = function () {
    const modal = document.querySelector(".modal");
    const overlay = document.querySelector(".overlay2");

    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  };

  const closeUserModal = function () {
    const modal = document.querySelector(".userModal");
    const overlay = document.querySelector(".overlay");

    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  };

  const closeFileModal = function () {
    const modal = document.querySelector(".fileModal");
    const overlay = document.querySelector(".overlay3");

    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  };

  const closeAnalyzeModal = function () {
    const modal = document.querySelector(".analyzeModal");
    const overlay = document.querySelector(".overlay4");

    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  };

  document.addEventListener("keydown", function (e) {
    const modal = document.querySelector(".modal");

    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });

  const [audioDetails, setAudioDetails] = useState({
    url: null,
    blob: null,
    chunks: null,
    duration: {
      h: 0,
      m: 0,
      s: 0,
    },
  });
  // audioDetails:

  const handleAudioStop = (data) => {
    // console.log("from stop button--> ", data);
    setShowData([]);
    setAudioDetails({ audioDetails: data });
    console.log("DATA--->", data);
    const url = URL.createObjectURL(data.blob);
    setURL(url);
    var wavfromblob = new File([data.blob], "test.wav");
    console.log("wavvvv", wavfromblob);
    if (wavfromblob.size < 10000) {
      alert("Recorded Audio size is less. Please record again");
      return;
    }
    const newData = new FormData();
    newData.append("filename", null);
    newData.append("file", wavfromblob);
    fetch("http://127.0.0.1:8080/uploader", {
      method: "POST",
      body: newData,
    }).then((response) => {
      response.json().then((body) => {
        console.log(body);
        setStop(true);
      });
    });
  };

  const SubmitME = () => {
    setShowData([]);

    setLoader2(true);
    const result = fetch("http://127.0.0.1:8080/test")
      .then((response) => response.json())
      .then((responseData) => setShowData(responseData));
    console.log(result);
    setStop(false);

    setLoader2(false);
    console.log(loader2);
  };

  const handleAudioUpload = (data) => {
    console.log(loader2);
    if (stop) {
      SubmitME();
    } else {
      alert("Record/Stop the audio first");
    }
  };

  const handleCountDown = (data) => {
    // console.log(data);
  };

  const handleReset = () => {
    // if (stop) {
    const reset = {
      url: null,
      blob: null,
      chunks: null,
      duration: {
        h: 0,
        m: 0,
        s: 0,
      },
    };
    setAudioDetails({ audioDetails: reset });
    // } else {
    //   alert("Record/Stop the audio first");
    // }
  };

  const statsData = () => {
    if (showData) {
      console.log(showData);
      var angry = 0;
      var normal = 0;
      for (let i = 0; i < showData.length; i++) {
        if (showData[i].includes("angry")) {
          angry = angry + 1;
        } else {
          normal = normal + 1;
        }
      }
    }
    return { angry, normal };
  };
  const emotionsCount = statsData();
  return (
    <div className="center">
      <div className="profile">
        {/* <Link to="/">
          <img alt="homepage" src={home} width="50px" />
        </Link>
        <h1>Try as a recorder</h1>
        <br /> */}
        {/* <span className="show-modal" onClick={openFileModal}>
          Upload Audio
        </span> */}
        <>
          {/* <RecordView /> */}
          <>
            {" "}
            <Recorder
              record={true}
              title={"New recording"}
              audioURL={audioDetails.url}
              showUIAudio
              handleAudioStop={(data) => {
                handleAudioStop(data);
                setStop(true);
              }}
              handleAudioUpload={(data) => {
                setLoader2(true);
                handleAudioUpload(data);
                stop && openAnalyzeModal();
                stop &&
                  setAudioDetails({
                    url: null,
                    blob: null,
                    chunks: null,
                    duration: {
                      h: 0,
                      m: 0,
                      s: 0,
                    },
                  });
              }}
              handleCountDown={(data) => handleCountDown(data)}
              handleReset={() => {
                handleReset();
                setStop(true);
              }}
              mimeTypeToUseWhenRecording={`audio/webm`} // For specific mimetype.
            />
            <ReactAudioPlayer
              src={audioDetails.url}
              controls
              style={{ width: "100%", margin: "auto" }}
            />
          </>
          {/* <button
            className="upload-file"
            onClick={(e) => {
              showButton(e);
              openAnalyzeModal();
            }}
          >
            Predict Emotions
          </button> */}
        </>
        {/* <span className="show-modal" onClick={openUserModal}>
          Live Audio Recorder
        </span> */}
      </div>

      {/* <div className="modal hidden">
        <div className="navbar">
          <h1>Audio Database</h1>
          <button className="uploader" onClick={openFileModal}>
            Upload
          </button>
        </div>
        <div className="body audio-body">
          <button
            className="dummy"
            onClick={() => {
              openAnalyzeModal();
            }}
            disabled={button}
          >
            Analyze
          </button>
        </div>
      </div> */}

      <div className="userModal hidden">
        <div className="navbar">
          <h1>Agents Database</h1>
        </div>
        <div className="body audio-body"></div>
      </div>

      <div className="fileModal hidden">
        <div className="navbar">
          <h1 style={{ marginBottom: "10px" }}>File Uploader</h1>
        </div>
        <div className="body">
          {/* <form onSubmit={uploadFile}>
            <label>Select file:</label>
            <br />
            <input
              className="uploader"
              type="file"
              accept="audio/wav"
              onChange={handleChange}
            />
            <span>{file && <>Selected file: {file.name}</>}</span>
            <br />
            <button className="upload-file" disabled={percent > 0}>
              Upload file
            </button> */}
          {/* <br />
            {percent === 100 ? (
              <p className="loader-text">Upload complete</p>
            ) : percent > 0 ? (
              <p className="loader-text">{percent}% done</p>
            ) : null}
            <br /> */}
          {/* </form> */}
        </div>
      </div>

      <div className="analyzeModal hidden">
        <div className="navbar">
          <h1 style={{ marginBottom: "10px" }}>Analyzer</h1>
        </div>
        <div className="body">
          {loader2 && (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          )}
          {!loader2 && showData.length != 0 ? (
            <div className="chart-container">
              <PieChart data={emotionsCount} totalEmotions={showData.length} />
              <>
                <ReactAudioPlayer
                  src={url}
                  controls
                  style={{ width: "100%", margin: "auto" }}
                />
              </>
            </div>
          ) : (
            <>
              {/* <Chart /> */}
              <div className="loader-container">
                <div className="loader"></div>
              </div>

              <br />
              {/* {url && (
                <ReactAudioPlayer
                  src={url}
                  controls
                  style={{ width: "100%", margin: "auto" }}
                />
              )} */}
            </>
          )}
        </div>
      </div>

      <div className="overlay4 hidden" onClick={closeAnalyzeModal}></div>
      <div className="overlay3 hidden" onClick={closeFileModal}></div>
      <div className="overlay2 hidden" onClick={closeModal}></div>
      <div className="overlay hidden" onClick={closeUserModal}></div>
    </div>
  );
}

export default Modal2;
