navigator.getUserMedia = navigator.getUserMedia || (<any>navigator).mozGetUserMedia || (<any>navigator).webkitGetUserMedia;

import { Injectable, OnDestroy } from '@angular/core';
import * as RecordRTC from 'recordrtc';

@Injectable()
export class RecordRTCService {
    _recorder: RecordRTC.MultiStreamRecorder;
    _canvasStream: MediaStream;
    _audioStream: MediaStream;

    public isRecording: boolean;

    initialize(canvasEl: any) {
        return this.getAudioMediaStream().then((audioStream) => {
            this._audioStream = audioStream;

            this._canvasStream = canvasEl.captureStream(40);

            this._recorder = new RecordRTC.MultiStreamRecorder(
                [this._audioStream, this._canvasStream],
                { mimeType: 'video/webm', frameInterval: 1 }
            );

            return this._recorder;
        });
    }

    getAudioMediaStream(): Promise<MediaStream> {
        return new Promise((resolve, reject) => {
            navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(
                (audioStream: MediaStream) => {
                    return resolve(audioStream);
                },
                err => reject(err)
            );
        });
    }

    startRecording(): Promise<boolean> {
        this._recorder.record();
        this.isRecording = true;

        //TODO: Set this to 30sec in prod
        return new Promise((resolve, reject) => {
            setTimeout(() => { 
                resolve(true);
            }, 30000);
        })
    }

    stopRecording(): Promise<{blob: Blob, blobUrl: string}> {
        return new Promise((resolve, reject) => {
            return this._recorder.stop((blob) => {
                this.isRecording = false;

                this._audioStream.getTracks().forEach((track) => track.stop());
                this._canvasStream.getTracks().forEach((track) => track.stop());

                const blobUrl = URL.createObjectURL(blob);

                console.log(blob);
                console.log(blobUrl);
                resolve({blob, blobUrl})
            });
        })
        
    }

    //Keeping around the below just in case...
    //Literally copy and pasted everything below and hacked out a bit...
    //It's a bit hairy down there, it should all be moved to the server

    // _workerPath: string = 'https://archive.org/download/ffmpeg_asm/ffmpeg_asm.js';
    // processInWebWorker() {
    //     var blob = URL.createObjectURL(new Blob(['importScripts('' + this._workerPath + '');var now = Date.now;function print(text) {postMessage({'type' : 'stdout','data' : text});};onmessage = function(event) {var message = event.data;if (message.type === 'command') {var Module = {print: print,printErr: print,files: message.files || [],arguments: message.arguments || [],TOTAL_MEMORY: message.TOTAL_MEMORY || false};postMessage({'type' : 'start','data' : Module.arguments.join(' ')});postMessage({'type' : 'stdout','data' : 'Received command: ' +Module.arguments.join(' ') +((Module.TOTAL_MEMORY) ? '.  Processing with ' + Module.TOTAL_MEMORY + ' bits.' : '')});var time = now();var result = ffmpeg_run(Module);var totalTime = now() - time;postMessage({'type' : 'stdout','data' : 'Finished processing (took ' + totalTime + 'ms)'});postMessage({'type' : 'done','data' : result,'time' : totalTime});}};postMessage({'type' : 'ready'});'], {
    //         type: 'application/javascript'
    //     }));
    //     var worker = new Worker(blob);
    //     URL.revokeObjectURL(blob);
    //     return worker;
    // }

    // convertStreams(videoBlob, audioBlob) {
    //     var self = this;

    //     var vab;
    //     var aab;
    //     var buffersReady;
    //     var workerReady;
    //     var posted = false;
    //     var fileReader1 = new FileReader();

    //     fileReader1.onload = function() {
    //         vab = this.result;
    //         if (aab) buffersReady = true;
    //         if (buffersReady && workerReady && !posted) postMessage();
    //     };

    //     var fileReader2 = new FileReader();

    //     fileReader2.onload = function() {
    //         aab = this.result;
    //         if (vab) buffersReady = true;
    //         if (buffersReady && workerReady && !posted) postMessage();
    //     };

    //     fileReader1.readAsArrayBuffer(videoBlob);
    //     fileReader2.readAsArrayBuffer(audioBlob);

    //     if (!this._worker) {
    //         this._worker = this.processInWebWorker();
    //     }

    //     this._worker.onmessage = function(event) {
    //         var message = event.data;
    //         if (message.type == 'ready') {
    //             workerReady = true;
    //             if (buffersReady)
    //                 postMessage();
    //         } else if (message.type == 'stdout') {
    //             //console.log('stdout', message.data);
    //         } else if (message.type == 'start') {
    //             //console.log('start', message.data);
    //         } else if (message.type == 'done') {
    //             var result = message.data[0];
    //             console.log('worker result', JSON.stringify(result));
    //             var blob = new Blob([result.data], {
    //                 type: 'video/mp4'
    //             });

    //             self.saveToDevice('output.mp4', blob);
    //         }
    //     };
    //     var postMessage = function() {
    //         posted = true;

    //         //TODO: figure out how to get the native .webm and .wav to convert here or on server to an acceptable twitter format... Good luck
    //         self._worker.postMessage({
    //             type: 'command',
    //             arguments: [
    //                 '-i', 'video.webm',
    //                 '-c:v', 'mpeg4',
    //                 '-i', 'audio.wav',
    //                 '-c:a', 'vorbis',
    //                 '-b:v', '6400k',
    //                 '-b:a', '4800k',
    //                 '-strict', 'experimental', 'output.mp4'
    //             ],
    //             files: [
    //                 {
    //                     data: new Uint8Array(vab),
    //                     name: 'video.webm'
    //                 },
    //                 {
    //                     data: new Uint8Array(aab),
    //                     name: 'audio.wav'
    //                 }
    //             ]
    //         });
    //     };
    // }

}