# HDF5 Viewer Extension for VS-Code (HighFive)

[![Licence](https://img.shields.io/github/license/lochbrunner/vscode-hdf5-viewer.svg)](https://github.com/lochbrunner/vscode-hdf5-viewer)
[![VS Code Marketplace](https://vsmarketplacebadge.apphb.com/version-short/lochbrunner.vscode-hdf5-viewer.svg) ![Rating](https://vsmarketplacebadge.apphb.com/rating-short/lochbrunner.vscode-hdf5-viewer.svg) ![Downloads](https://vsmarketplacebadge.apphb.com/downloads-short/lochbrunner.vscode-hdf5-viewer.svg) ![Installs](https://vsmarketplacebadge.apphb.com/installs-short/lochbrunner.vscode-hdf5-viewer.svg)](https://marketplace.visualstudio.com/items?itemName=lochbrunner.vscode-hdf5-viewer)

> This is a special version of the *HDF5 Viewer Extension for VS-Code* that is based on [Highfive](https://github.com/BlueBrain/HighFive).
As this extension uses C++ and is compiled against a specific version of nodejs, it might not work with your installed VS Code Version.

![](https://raw.githubusercontent.com/lochbrunner/vscode-hdf5-viewer/master/docs/screenshot.png)

## Usage

Right click on the file and click on `Hdf5 Viewer` to display the file. 

## Contributing

### Build


```bash
yarn build-client
yarn build-extension
vsce package
```