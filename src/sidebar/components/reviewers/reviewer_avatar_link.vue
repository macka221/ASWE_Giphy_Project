<script>
// NOTE! For the first iteration, we are simply copying the implementation of Assignees
// It will soon be overhauled in Issue https://gitlab.com/gitlab-org/gitlab/-/issues/233736
import { GlTooltipDirective, GlLink } from '@gitlab/ui';
import { __, sprintf } from '~/locale';
import ReviewerAvatar from './reviewer_avatar.vue';

export default {
  components: {
    ReviewerAvatar,
    GlLink,
  },
  directives: {
    GlTooltip: GlTooltipDirective,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
    rootPath: {
      type: String,
      required: true,
    },
    tooltipPlacement: {
      type: String,
      default: 'bottom',
      required: false,
    },
    tooltipHasName: {
      type: Boolean,
      default: true,
      required: false,
    },
    issuableType: {
      type: String,
      default: 'issue',
      required: false,
    },
  },
  computed: {
    cannotMerge() {
      return this.issuableType === 'merge_request' && !this.user.can_merge;
    },
    tooltipTitle() {
      if (this.cannotMerge && this.tooltipHasName) {
        return sprintf(__('%{userName} (cannot merge)'), { userName: this.user.name });
      } else if (this.cannotMerge) {
        return __('Cannot merge');
      } else if (this.tooltipHasName) {
        return this.user.name;
      }

      return '';
    },
    tooltipOption() {
      return {
        container: 'body',
        placement: this.tooltipPlacement,
        boundary: 'viewport',
      };
    },
    reviewerUrl() {
      return this.user.web_url;
    },
  },
};
</script>

<template>
  <!-- must be `d-inline-block` or parent flex-basis causes width issues -->
  <gl-link
    v-gl-tooltip="tooltipOption"
    :href="reviewerUrl"
    :title="tooltipTitle"
    class="d-inline-block"
  >
    <!-- use d-flex so that slot can be appropriately styled -->
    <span class="gl-display-flex gl-align-items-center">
      <reviewer-avatar :user="user" :img-size="32" :issuable-type="issuableType" />
      <slot :user="user"></slot>
    </span>
  </gl-link>
</template>
