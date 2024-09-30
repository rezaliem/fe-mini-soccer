<template>
  <!-- view -->
  <div
    style="
      box-shadow: 3px 3px 7px rgb(0, 0, 0, 0.2);

      padding-block: 20px;
      border-radius: 15px;
      height: 150px;
      background-color: rgb(175, 175, 0, 0.2);
      cursor: pointer;
    "
    :style="
      isMobile
        ? 'width:100%; padding-inline: 20px;'
        : 'width:100%; padding-inline: 80px;'
    "
    class="boxInner"
    :class="
      isMobile
        ? 'flex items-center justify-center'
        : 'flex items-center justify-between'
    "
    @click="selectedMenuHandler('view')"
  >
    <img
      v-if="!isMobile"
      src="~/assets/images/view.png"
      alt=""
      srcset=""
      style="height: 100%; width: 30%"
    />
    <div
      class="font-belanosima-600"
      style="color: green"
      :style="isMobile ? 'font-size:16pt' : 'font-size: 24pt'"
    >
      Lihat
    </div>
  </div>
  <!-- payment -->
  <div
    v-if="stepReservation === 'pending-menu' && !selectedSchedule.package"
    style="
      box-shadow: 3px 3px 7px rgb(0, 0, 0, 0.2);

      padding-block: 20px;
      border-radius: 15px;
      height: 150px;
      background-color: rgb(0, 175, 0, 0.2);
      cursor: pointer;
      margin-top: 20px;
    "
    :style="
      isMobile
        ? 'width:100%; padding-inline: 20px;'
        : 'width:100%; padding-inline: 80px;'
    "
    class="boxInner"
    :class="
      isMobile
        ? 'flex items-center justify-center'
        : 'flex items-center justify-between'
    "
    @click="selectedMenuHandler('payment')"
  >
    <img
      v-if="!isMobile"
      src="~/assets/images/money.png"
      alt=""
      srcset=""
      style="height: 100%; width: 30%"
    />
    <div
      class="font-belanosima-600"
      style="color: green"
      :style="isMobile ? 'font-size:16pt' : 'font-size: 24pt'"
    >
      Pembayaran
    </div>
  </div>
  <!-- edit -->
  <div
    v-if="!selectedSchedule.package"
    style="
      box-shadow: 3px 3px 7px rgb(0, 0, 0, 0.2);
      padding-inline: 80px;
      padding-block: 20px;
      border-radius: 15px;
      height: 150px;
      background-color: rgb(0, 0, 175, 0.2);
      margin-top: 20px;
      cursor: pointer;
    "
    :style="[
      isMobile
        ? 'width:100%; padding-inline: 20px;'
        : 'width:100%; padding-inline: 80px;',
    ]"
    class="boxInner font-belanosima-400"
    :class="
      isMobile
        ? 'flex items-center justify-center'
        : 'flex items-center justify-between'
    "
    @click="selectedMenuHandler('edit')"
  >
    <img
      v-if="!isMobile"
      src="~/assets/images/edit.png"
      alt=""
      srcset=""
      style="height: 100%"
    />
    <div
      class="font-belanosima-600"
      style="color: blue"
      :style="isMobile ? 'font-size:16pt' : 'font-size: 24pt'"
    >
      Ubah Reservasi
    </div>
  </div>
  <!-- cancel -->
  <div
    style="
      box-shadow: 3px 3px 7px rgb(0, 0, 0, 0.2);
      padding-inline: 80px;
      padding-block: 20px;
      border-radius: 15px;
      height: 150px;
      background-color: rgb(175, 0, 0, 0.2);
      cursor: pointer;
      margin-top: 20px;
      width: 80%;
    "
    :style="
      isMobile
        ? 'width:100%; padding-inline: 20px;'
        : 'width:100%; padding-inline: 80px;'
    "
    class="boxInner font-belanosima-400 mt-2"
    :class="
      isMobile
        ? 'flex items-center justify-center'
        : 'flex items-center justify-between'
    "
    @click="selectedMenuHandler('cancel')"
  >
    <img
      v-if="!isMobile"
      src="~/assets/images/cancel.png"
      alt=""
      srcset=""
      style="height: 100%"
    />
    <div
      class="font-belanosima-600"
      style="color: red"
      :style="isMobile ? 'font-size:16pt' : 'font-size: 24pt'"
    >
      Batal Reservasi
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useGeneralStore } from "~/store/general";

const props = defineProps({
  stepReservation: {
    type: String,
    default: "",
  },
  selectedSchedule: {
    type: Object,
    default: null,
  },
});

const UseGeneralStore = useGeneralStore();
const { isMobile } = storeToRefs(UseGeneralStore);
const emit = defineEmits(["menuHandler"]);
const selectedMenuHandler = (menuOption) => {
  emit("menuHandler", menuOption);
};
</script>

<style scoped>
.font-belanosima-600 {
  font-family: "belanosima", sans-serif;
  font-weight: 600;
}

.font-quicksand-400 {
  font-family: "quicksand", sans-serif;
  font-weight: 400;
}

.n-drawer-container .boxInner:hover {
  -webkit-transform: scale(1.03);
  -moz-transform: scale(1.03);
  -ms-transform: scale(1.03);
  -o-transform: scale(1.03);
  transform: scale(1.03);
}
</style>
