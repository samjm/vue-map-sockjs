<template>
    <div style="padding:0; margin:0; height:100vh;">
        <!-- <div id="main-content" class="container"> -->
            <!-- <b-alert show>Default Alert</b-alert> -->

            <!-- <b-alert :show="dismissCountDown"
                     dismissible
                     variant="warning"
                     @dismissed="dismissCountDown=0"
                     @dismiss-count-down="countDownChanged">
              <p>{{alertDescription}}</p>
              <b-progress variant="warning"
                          :max="dismissSecs"
                          :value="dismissCountDown"
                          height="4px">
              </b-progress>
            </b-alert> -->

            <vue-snotify></vue-snotify>

            <!-- <div class="row">
                <div class="col-md-6">
                    <form class="form-inline">
                        <div class="form-group">
                            <label for="connect">WebSocket connection:</label>
                            <button id="connect" class="btn btn-default" type="submit" :disabled="connected == true" @click.prevent="connect">Connect</button>
                            <button id="disconnect" class="btn btn-default" type="submit" :disabled="connected == false" @click.prevent="disconnect">Disconnect
                            </button>
                        </div>
                    </form>
                </div>
                <div class="col-md-6">
                    <form class="form-inline">
                        <div class="form-group">
                            <label for="name">What is your name?</label>
                            <input type="text" id="name" class="form-control" v-model="send_message" placeholder="Your name here...">
                        </div>
                        <button id="send" class="btn btn-default" type="submit" @click.prevent="send">Send</button>
                    </form>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <table id="conversation" class="table table-striped">
                        <thead>
                            <tr>
                                <th>Greetings</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in received_messages" :key="item">
                                <td>{{ item }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div> -->



            <!-- <b-btn @click="showAlert" variant="info" class="m-1">
              Show alert with count-down timer
            </b-btn> -->


            <div style="height: 100%; width: 100%;">
                <!-- <div style="height: 100%; width:100%; overflow: auto;">
                  <h3>Simple map</h3>
                  <p>First marker is placed at {{ withPopup.lat }}, {{ withPopup.lng }}</p>
                  <p> Center is at {{ currentCenter }} and the zoom is: {{ currentZoom }} </p>
                  <button @click="showLongText">Toggle long popup</button>
                </div> -->

                <l-map
                  :zoom="zoom"
                  :center="center"
                  :options="mapOptions"
                  @update:center="centerUpdate"
                  @update:zoom="zoomUpdate"
                >
                  <l-tile-layer
                    :url="url"
                    :attribution="attribution"
                  />
                  <!-- <l-marker :lat-lng="withPopup">
                    <l-popup>
                      <div @click="innerClick">
                        I am a popup
                        <p v-show="showParagraph">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sed pretium nisl, ut sagittis sapien. Sed vel sollicitudin nisi. Donec finibus semper metus id malesuada.
                        </p>
                      </div>
                    </l-popup>
                  </l-marker>
                  <l-marker :lat-lng="withTooltip">
                    <l-tooltip :options="{permanent: true, interactive: true}">
                      <div @click="innerClick">
                        I am a tooltip
                        <p v-show="showParagraph">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sed pretium nisl, ut sagittis sapien. Sed vel sollicitudin nisi. Donec finibus semper metus id malesuada.
                        </p>
                      </div>
                    </l-tooltip>
                  </l-marker> -->
                  <l-marker
                    v-for="marker in markers"
                    :key="marker.id"
                    :visible="marker.visible"
                    :draggable="marker.draggable"
                    :lat-lng.sync="marker.position"
                    :icon="marker.icon"
                    @click="alert(marker)">
                    <l-popup :content="marker.tooltip" />
                    <l-tooltip :content="marker.tooltip" />
                  </l-marker>
                </l-map>
            </div>


        <!-- </div> -->

    </div>
</template>

<script>
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import {Snotify, SnotifyStyle, SnotifyPosition} from 'vue-snotify';
import 'vue-snotify/styles/material.css';


export default {
  name: "websocketdemo",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LTooltip
  },
  data() {
    return {
      received_messages: [],
      send_message: null,
      connected: false,
      dismissSecs: 4,
      dismissCountDown: 0,
      alertDescription:null,
      alertTitle:null,
      zoom: 13,
      center: L.latLng(19.442487, -99.127828),
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      // withPopup: L.latLng(47.413220, -1.219482),
      // withTooltip: L.latLng(47.414220, -1.250482),
      currentZoom: 11.5,
      currentCenter: L.latLng(19.442487, -99.127828),
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5
      },
      markers: [
        // { id: 'm1',
        //   position: {lat: 51.505, lng: -0.09},
        //   tooltip: 'tooltip for marker1',
        //   draggable: false,
        //   visible: true
        // },
        // { id: 'm2', position: {lat: 51.8905, lng: -0.09}, tooltip: 'tooltip for marker2', draggable: false, visible: true },
        // { id: 'm3', position: {lat: 51.005, lng: -0.09}, tooltip: 'tooltip for marker3', draggable: false, visible: true },
        // { id: 'm4', position: {lat: 50.7605, lng: -0.09}, tooltip: 'tooltip for marker4', draggable: false, visible: true }
      ]
    };
  },
  methods: {
    send() {
      console.log("Send message:" + this.send_message);
      if (this.stompClient && this.stompClient.connected) {
        const msg = { name: this.send_message };
        this.stompClient.send("/app/hello", JSON.stringify(msg), {});
      }
    },
    connect() {
      this.socket = new SockJS("http://172.16.81.106:9000/back-sdk/smartcity");
      this.stompClient = Stomp.over(this.socket);
      this.stompClient.connect(
        {},
        frame => {
          this.connected = true;
          //console.log(frame);
          this.stompClient.subscribe("/websocket/alerts", tick => {
            console.log("test:" + tick.body);
            var content = JSON.parse(tick.body);
            this.alertDescription = content.description;
            this.alertTitle = content.eventObserved;
            this.dismissCountDown = this.dismissSecs;

            var estilo = SnotifyStyle.info;

            if (content.alertType==='security' && content.eventObserved==='BuildingFire'){
              estilo = SnotifyStyle.error;
              //this.$snotify.error(this.alertDescription,this.alertTitle,{});
            }else if (content.alertType==='environment' && content.eventObserved==='Pollen concentration'){
              estilo = SnotifyStyle.warning;
              //this.$snotify.warning(this.alertDescription,this.alertTitle,{});
            }
            //else{
              //this.$snotify.info(this.alertDescription,this.alertTitle,{});
            //}

            this.$snotify.create({
              title: this.alertTitle,
              body: this.alertDescription,
              config: {
                position: SnotifyPosition.rightBottom,
                type: estilo,
                titleMaxLength : 100,
                bodyMaxLength: 150
              }
            })

            var mark = { id: content.id, position: {lat: content.location[0], lng: content.location[1]}, tooltip: this.alertDescription, draggable: false, visible: true };
            this.markers.push(mark);
          });
        },
        error => {
          //console.log(error);
          this.connected = false;
        }
      );
    },
    disconnect() {
      if (this.stompClient) {
        this.stompClient.disconnect();
      }
      this.connected = false;
    },
    tickleConnection() {
      this.connected ? this.disconnect() : this.connect();
    },
    countDownChanged (dismissCountDown) {
        this.dismissCountDown = dismissCountDown
    },
    showAlert () {
        this.dismissCountDown = this.dismissSecs
    },
    zoomUpdate (zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate (center) {
      this.currentCenter = center;
    },
    showLongText () {
      this.showParagraph = !this.showParagraph;
    },
    innerClick () {
      alert('Click!');
    }
  },
  mounted() {
    // this.connect();
  },
  created(){
    this.connect();
  }
};
</script>

<style scoped>

</style>
