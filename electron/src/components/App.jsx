import React, { useState, useEffect, useRef } from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Status from "./Status";
import Selector from "./Selector";
import Labels from "./Labels";
import GoButton from "./GoButton";
import { buildFeatureExtractor } from "../utils/ml5";
import { StatusContext, LabelContext } from "../contexts";

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  height: "800px"
};
const mainStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "210px"
};

function App() {
  const videoEl = useRef(null);
  const [status, setStatus] = useState("status.ready");
  const [labelCount, setLabelCount] = useState(2);
  const [targetLabel, setTargetLabel] = useState(null);
  const [classifier, setClassifier] = useState(null);
  const [videos, setVideos] = useState([]);
  const [did, setDid] = useState();

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(values => {
      setVideos(values.filter(x => x.kind === "videoinput"));
    });
  }, []);

  useEffect(() => {
    const setVideo = async () => {
      videoEl.current.srcObject = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: did
        }
      });
      setClassifier(buildFeatureExtractor(videoEl.current));
    };
    setVideo();
  }, [did]);

  return (
    <StatusContext.Provider
      value={{
        status,
        setStatus
      }}
    >
      <LabelContext.Provider
        value={{
          labelCount,
          setLabelCount,
          targetLabel,
          setTargetLabel
        }}
      >
        <div style={containerStyle}>
          <div>Select Camera</div>
          <RadioGroup row aria-label="gender" name="row-radio-buttons-group">
            {videos.map((video, index) => (
              <FormControlLabel
                key={video.deviceId}
                value={video.deviceId}
                control={<Radio onChange={() => setDid(video.deviceId)} />}
                label={index}
              />
            ))}
          </RadioGroup>
          <video ref={videoEl} width="480px" height="360px" autoPlay />
          <div style={mainStyle}>
            <Status />
            <Selector />
            <Labels classifier={classifier} />
            <GoButton classifier={classifier} />
          </div>
        </div>
      </LabelContext.Provider>
    </StatusContext.Provider>
  );
}

export default App;
