import React from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';
import MicIcon from '@material-ui/icons/Mic';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import "./GetAudio.css";
const audioType = 'audio/webm';

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recording: false,
      audios: [],
    };
  }

  async componentDidMount() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: false, audio: true });

    this.audio.srcObject = stream;
    // this.audio.play();
    // init recording
    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType: audioType,
    });
    // init data storage for audio chunks
    this.chunks = [];
    // listen for data from media recorder
    this.mediaRecorder.ondataavailable = e => {
      if (e.data && e.data.size > 0) {
        this.chunks.push(e.data);
      }
    };
  }
  startRecording(e) {
    e.preventDefault();
    // wipe old data chunks
    this.chunks = [];
    // start recorder with 10ms buffer
    this.mediaRecorder.start(1000);
    // say that we're recording
    this.setState({ recording: true });
  }

  stopRecording(e) {
    e.preventDefault();
    // stop the recorder
    this.mediaRecorder.stop();
    // say that we're not recording
    this.setState({ recording: false });
    // save the audio to memory
    this.saveaudio();
  }

  saveaudio() {
    // convert saved chunks to blob
    const blob = new Blob(this.chunks, { type: audioType });
    // generate audio url from blob
    const audioURL = window.URL.createObjectURL(blob);
    // append audioURL to list of saved audios for rendering
    const audios = this.state.audios.concat([audioURL]);
    this.setState({ audios });
  }

  deleteaudio(audioURL) {
    // filter out current audioURL from the list of saved audios
    const audios = this.state.audios.filter(v => v !== audioURL);
    this.setState({ audios });
  }
  render() {
    const { recording, audios } = this.state;
    return (
      <div className="Audio">
        <audio
          ref={v => {
            this.audio = v;
          }}>
          audio stream not available.
        </audio>
        <div className="icon">
          {!recording && <MicIcon onClick={e => this.startRecording(e)} />}
          {recording && <PauseCircleOutlineIcon onClick={e => this.stopRecording(e)} />}
        </div>
        <div>
          {/* <h3>Recorded audios:</h3> */}
          {audios.map((audioURL, i) => (
            <div key={`audio_${i}`}>
              {/* <audio style={{width: 200}} src={audioURL} autoPlay loop /> */}
              <div>
                <audio src={audioURL}></audio>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

}