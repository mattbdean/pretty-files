<template>
    <div class="sidenav-container">
        <div class="header non-interactive">
            <i class="material-icons md-36 account-icon">account_circle</i>
            <span class="username">{{ username }}</span>
        </div>
        <div class="contents">
            <md-list>
                <md-subheader class="non-interactive">Places</md-subheader>
                <md-list-item @click.native="cd(homedir)">
                    <md-icon :md-src="folderIcon"></md-icon>
                    <span>Home</span>
                </md-list-item>

                <md-subheader class="non-interactive">Drives</md-subheader>
                <md-list-item v-for="drive in drives" :key="drive.device" @click.native="showDrive(drive)">
                    <md-icon :md-src="diskIcon"></md-icon>
                    <span class="drive-name">{{ drive.mountpoints[0].path }}</span>
                </md-list-item>
            </md-list>
        </div>
    </div>
</template>

<script>
    import os from 'os';
    import username from 'username';

    import { getMountedDrives } from '../helpers/path.helper';
    import { state } from '../helpers/state.helper';
    import diskIcon from '../../assets/harddisk.svg';
    import folderIcon from '../../assets/folder.svg';

    export default {
        data: () => ({
            username: null,
            drives: null,
            homedir: os.homedir(),
            diskIcon,
            folderIcon
        }),
        methods: {
            showDrive: (drive) => {
                state.cd(drive.mountpoints[0].path);
            },
            cd: state.cd
        },
        created: async function() {
            this.username = await username();
            this.drives = await getMountedDrives();
        }
    };
</script>

<style scoped>
    .sidenav-container {
        height: 100vh;
        width: 250px;
        overflow: auto;
    }

    .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: 15px 0;

        border-bottom: 1px solid rgba(0,0,0,.12);
    }

    .username {
        font-size: 18px;
    }

    .account-icon {
        margin-right: 10px;
    }

    .drive-name {
        margin-right: 15px;
    }
</style>
