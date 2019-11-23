import React from 'react';
import { observer } from 'mobx-react';
import './App.css';
import { IdentityDefinitionForm, signAndUploadIdentity, serialize } from '@dorgtech/id-dao-client';
import Webcam from 'react-webcam';
import VideoRecorder from 'react-video-recorder';
import { ContentHost } from '@dorgtech/id-dao-client/dist/IdentityDefinition/types';
import { b64toBlob } from './utils';
require("dotenv").config();
const ipfsClient = require("ipfs-http-client");
const toBuffer = require("blob-to-buffer");
const JsZip = require("jszip");
const saveFile = require("file-saver");

interface State {
  selfieImage?: any;
  selfieVideo?: Blob;
  saveError?: String;
}

@observer
class IdentityDefinitonBuilder extends React.Component<{}, State> {
  form = new IdentityDefinitionForm();
  webCamRef = React.createRef<any>();

  constructor(props: {}) {
    super(props)
    this.state = { };
  }

  setSelfie = () => {
    const imageSrc = this.webCamRef.current.getScreenshot();
    const imageBlob = b64toBlob(imageSrc.replace("data:image/jpeg;base64,", ""));

    const ipfs = ipfsClient("localhost", process.env.IPFS_PORT);

    toBuffer(imageBlob, async (error: Error, buffer: Buffer) => {
      if (error) {
        console.log(error);
        this.setState({
          saveError: error.message
        });
        return;
      }

      const hash = await ipfs.add(buffer);

      if (hash.length > 0) {
        console.log(hash[0].path);
        this.form.$.uploads.$.selfie.data = {
          host: ContentHost.IPFS,
          hash: hash[0].path
        }
      } else {
        this.setState({
          saveError: "Failed to upload image to IPFS"
        });
      }
    });

    this.setState({
      selfieImage: imageSrc
    });
  }

  resetSelfie = () => {
    this.form.$.uploads.$.selfie.data = {
      host: ContentHost.Unknown,
      hash: ""
    };

    this.setState({
      selfieImage: undefined
    });
  }

  setVideo = (videoBlob: any, startedAt: any, thumbnailBlob: any, duration: any) => {
    const mp4Blob = new Blob([videoBlob], {type: 'video/mp4'});

    const ipfs = ipfsClient("localhost", process.env.IPFS_PORT);

    toBuffer(mp4Blob, async (error: Error, buffer: Buffer) => {
      if (error) {
        console.log(error);
        this.setState({
          saveError: error.message
        });
        return;
      }

      const hash = await ipfs.add(buffer);

      if (hash.length > 0) {
        console.log(hash[0].path);
        this.form.$.uploads.$.video.data = {
          host: ContentHost.IPFS,
          hash: hash[0].path
        };
      } else {
        this.setState({
          saveError: "Failed to upload video to IPFS"
        });
      }
    });

    this.setState({
      selfieVideo: mp4Blob
    });
  }

  saveIdentity = async () => {
    this.setState({
      saveError: undefined
    });

    // Validate the form
    const res = await this.form.validate();

    if (res.hasError) {
      console.log(this.form.error);
      this.setState({
        saveError: this.form.error as string
      });
      return;
    }

    console.log(this.form.data);

    try {
      // Sign the Identity
      const { hash, sig } = await signAndUploadIdentity(this.form.data);

      // Create the zip
      const zip = new JsZip();
      const { selfieImage, selfieVideo } = this.state;

      // Save the image
      if (selfieImage) {
        zip.file(
          `${this.form.$.uploads.$.selfie.$.hash.value}.jpeg`,
          selfieImage.replace("data:image/jpeg;base64,", ""),
          { base64: true }
        );
      }

      // Save the video
      if (selfieVideo) {
        zip.file(
          `${this.form.$.uploads.$.video.$.hash.value}.mp4`,
          selfieVideo,
          { binary: true }
        );
      }

      // Save the IdentityDefinition.json
      zip.file(`${hash}.json`, serialize(this.form.data));

      // Save the signature
      zip.file("sig", sig)

      // Save the zip file
      zip.generateAsync({ type: "blob" }).then((content: any) => {
        saveFile(content,  `${this.form.$.address.value}_IdentityDefinition`);
      });
    } catch (e) {
      this.setState({
        saveError: e.message
      });
    }
  }

  render() {
    const form = this.form;
    const { selfieImage, selfieVideo, saveError } = this.state;

    return (
      <>
        <h1>Identity Defintion</h1>
        {"address: "}
        <input
          type="text"
          value={form.$.address.value}
          onChange={(e)=>form.$.address.onChange(e.target.value)}
        />
        <p style={{ color: "red" }}>
          {form.$.address.error}
        </p>
        {"name: "}
        <input
          type="text"
          value={form.$.name.value}
          onChange={(e)=>form.$.name.onChange(e.target.value)}
        />
        <p style={{ color: "red" }}>
          {form.$.name.error}
        </p>
        {"socialPosts:"}<br/>
        {"  github:"}
        <input
          type="text"
          value={form.$.socialPosts.$.github.value}
          onChange={(e)=>form.$.socialPosts.$.github.onChange(e.target.value)}
        />
        <p style={{ color: "red" }}>
          {form.$.socialPosts.$.github.error}
        </p>
        {"  twitter:"}
        <input
          type="text"
          value={form.$.socialPosts.$.twitter.value}
          onChange={(e)=>form.$.socialPosts.$.twitter.onChange(e.target.value)}
        />
        <p style={{ color: "red" }}>
          {form.$.socialPosts.$.twitter.error}
        </p>
        {"uploads:"}<br/>
        {"  selfie:"}<br/>
        {selfieImage !== undefined ?
          <>
            <img src={selfieImage} />
            <br/>
            <div>{this.form.$.uploads.$.selfie.$.host.value}</div>
            <div>{this.form.$.uploads.$.selfie.$.hash.value}</div>
            <button type="button" onClick={this.resetSelfie}>
              Reset photo
            </button>
            <br/>
          </> :
          <>
            <Webcam
              screenshotFormat={"image/jpeg"}
              ref={this.webCamRef}
            />
            <br/>
            <button type="button" onClick={this.setSelfie}>
              Capture photo
            </button>
            <br/>
          </>
        }
        <p style={{ color: "red" }}>
          {form.$.uploads.$.selfie.error}
        </p>
        {"  video:"}
        <br/>
        <VideoRecorder onRecordingComplete={this.setVideo} />
        {selfieVideo ?
          <>
            <div>{this.form.$.uploads.$.video.$.host.value}</div>
            <div>{this.form.$.uploads.$.video.$.hash.value}</div>
          </> :
          <></>
        }
        <p style={{ color: "red" }}>
          {form.$.uploads.$.video.error}
        </p>
        <br/>
        {saveError ?
          <div style={{ color: "red" }}>
            Errors Found. Check the browser's console if nothing shown in the UI.
          </div> :
          <></>
        }
        <button type="button" onClick={this.saveIdentity}>
          Save Identity
        </button>
      </>
    );
  }
}

export default IdentityDefinitonBuilder;
