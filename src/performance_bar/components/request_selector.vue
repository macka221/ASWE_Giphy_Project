<script>
import { GlPopover, GlSafeHtmlDirective } from '@gitlab/ui';
import { glEmojiTag } from '~/emoji';
import { n__ } from '~/locale';

export default {
  components: {
    GlPopover,
  },
  directives: {
    SafeHtml: GlSafeHtmlDirective,
  },
  props: {
    currentRequest: {
      type: Object,
      required: true,
    },
    requests: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      currentRequestId: this.currentRequest.id,
    };
  },
  computed: {
    requestsWithWarnings() {
      return this.requests.filter((request) => request.hasWarnings);
    },
    warningMessage() {
      return n__(
        '%d request with warnings',
        '%d requests with warnings',
        this.requestsWithWarnings.length,
      );
    },
  },
  watch: {
    currentRequestId(newRequestId) {
      this.$emit('change-current-request', newRequestId);
    },
  },
  methods: {
    glEmojiTag,
  },
  safeHtmlConfig: { ADD_TAGS: ['gl-emoji'] },
};
</script>
<template>
  <div id="peek-request-selector" data-qa-selector="request_dropdown" class="view">
    <select v-model="currentRequestId">
      <option
        v-for="request in requests"
        :key="request.id"
        :value="request.id"
        data-qa-selector="request_dropdown_option"
      >
        {{ request.truncatedUrl }}
        <span v-if="request.hasWarnings">(!)</span>
      </option>
    </select>
    <span v-if="requestsWithWarnings.length" class="gl-cursor-default">
      <span
        id="performance-bar-request-selector-warning"
        v-safe-html:[$options.safeHtmlConfig]="glEmojiTag('warning')"
      ></span>
      <gl-popover
        placement="bottom"
        target="performance-bar-request-selector-warning"
        :content="warningMessage"
      />
    </span>
  </div>
</template>
