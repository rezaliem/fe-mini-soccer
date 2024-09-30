<template>
  <div
    style="
      box-shadow: 3px 3px 7px rgb(0, 0, 0, 0.2);
      padding-inline: 5px;
      padding-block: 15px;
      border-radius: 15px;
      cursor: pointer;
      height: 100px;
    "
    :style="
      schedule.status === 'available'
        ? 'background-color : green; color:white'
        : schedule.status === 'reserved' &&
          schedule.reservedBy.status === 'pending'
        ? 'background-color : yellow; color:black'
        : schedule.status === 'reserved' &&
          schedule.reservedBy.status === 'paid'
        ? 'background-color : red; color:white'
        : ''
    "
    class="font-belanosima-400 justify-round flex flex-col"
    @click="availabilitySelectedHandler(schedule)"
  >
    <div
      class="flex justify-center"
      :style="isMobile ? 'font-size:10pt' : 'font-size:14pt'"
    >
      {{ `${schedule.time}:00` }}
    </div>

    <div>
      <div class="flex justify-center">
        {{
          schedule.status === "available"
            ? `Rp. ${schedule.price.toLocaleString("en-AU")}`
            : `${schedule.reservedBy.name}`
        }}
      </div>
      <div class="flex justify-center">
        {{
          schedule.reservedBy?.status === "pending"
            ? `${schedule.reservedBy?.receipt_no} - Expired ${schedule.reservedBy.expired_timezone}`
            : schedule.reservedBy?.status === "paid"
            ? `${schedule.reservedBy?.receipt_no}`
            : null
        }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useGeneralStore } from "~/store/general";
const UseGeneralStore = useGeneralStore();
const { isMobile } = storeToRefs(UseGeneralStore);

defineProps({
  schedule: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["availabilitySelectedHandler"]);

const availabilitySelectedHandler = (schedule) => {
  emit("availabilitySelectedHandler", schedule);
};
</script>

<style scoped></style>
