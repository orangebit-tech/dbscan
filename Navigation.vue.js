const Navigation = {
  template: `
      <nav class="navbar navbar-expand-md" style="background-color: #ffffff;">
        <div class="nav-brand font-weight-bold">Vue-Axios Demo</div>

        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ml-auto mt-2 mt-lg-0 font-weight-bold">
            <li>
              <router-link class="nav-link" to="/">
                Access
              </router-link>
            </li>
            <li v-if="authstatus">
              <router-link class="nav-link" to="content">
                    Content
              </router-link>
            </li>
           
           
          </ul>
        </div>
      </nav>
  `,
  computed: {
    authstatus() {
      //  used to show/hide `content` link
      return this.$root.authstatus;
    },
  },
};