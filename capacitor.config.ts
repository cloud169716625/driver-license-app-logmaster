import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'logmaster.camera.app',
  appName: 'driver-license-plugin-test-app',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
    cleartext: true,
  },
}

export default config
