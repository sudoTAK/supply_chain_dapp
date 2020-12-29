App = {
  web3Provider: null,
  contracts: {},
  emptyAddress: "0x0000000000000000000000000000000000000000",
  sku: 0,
  upc: 0,
  metamaskAccountID: "0x0000000000000000000000000000000000000000",
  ownerID: "0x0000000000000000000000000000000000000000",
  originFarmerID: "0x0000000000000000000000000000000000000000",
  originFarmName: null,
  originFarmInformation: null,
  originFarmLatitude: null,
  originFarmLongitude: null,
  productNotes: null,
  productPrice: 0,
  distributorID: "0x0000000000000000000000000000000000000000",
  retailerID: "0x0000000000000000000000000000000000000000",
  consumerID: "0x0000000000000000000000000000000000000000",
  farmerEventArr: ["Harvested", "Processed", "Packed", "ForSale"],
  productDetailArr: ["Sold", "Shipped", "Received", "Purchased"],
  itemStates: ["Harvested", "Processed", "Packed", "ForSale", "Sold", "Shipped", "Received", "Purchased"],
  isMetaMaskAccountLoaded: false, //used to prefill farmer accout id with metamask first account. used once per page refresh
  ipfs: window.IpfsHttpClient("ipfs.infura.io", "5001", { protocol: "https" }),
  init: async function () {
    App.readForm();
    /// Setup access to blockchain
    return await App.initWeb3();
  },

  readForm: function () {
    App.sku = $("#sku").val();
    App.upc = $("#upc").val();
    App.ownerID = $("#ownerID").val();
    App.originFarmerID = $("#originFarmerID").val();
    App.originFarmName = $("#originFarmName").val();
    App.originFarmInformation = $("#originFarmInformation").val();
    App.originFarmLatitude = $("#originFarmLatitude").val();
    App.originFarmLongitude = $("#originFarmLongitude").val();
    App.productNotes = $("#productNotes").val();
    App.productPrice = $("#productPrice").val();
    App.distributorID = $("#distributorID").val();
    App.retailerID = $("#retailerID").val();
    App.consumerID = $("#consumerID").val();

    console.log(
      App.sku,
      App.upc,
      App.ownerID,
      App.originFarmerID,
      App.originFarmName,
      App.originFarmInformation,
      App.originFarmLatitude,
      App.originFarmLongitude,
      App.productNotes,
      App.productPrice,
      App.distributorID,
      App.retailerID,
      App.consumerID
    );
  },

  initWeb3: async function () {
    /// Find or Inject Web3 Provider
    /// Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access");
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider("http://localhost:7545");
    }

    App.getMetaskAccountID();
    return App.initSupplyChain();
  },

  getMetaskAccountID: function () {
    web3 = new Web3(App.web3Provider);

    // Retrieving accounts
    web3.eth.getAccounts(function (err, res) {
      if (err) {
        console.log("Error:", err);
        return;
      }
      console.log("getMetaskID:", res);
      App.metamaskAccountID = res[0];
      if (App.isMetaMaskAccountLoaded == false) {
        $("#originFarmerID").val(res[0]);
        App.isMetaMaskAccountLoaded = true;
      }
    });
  },

  initSupplyChain: function () {
    /// Source the truffle compiled smart contracts
    var jsonSupplyChain = "../../build/contracts/SupplyChain.json";

    /// JSONfy the smart contracts
    $.getJSON(jsonSupplyChain, function (data) {
      console.log("data", data);
      var SupplyChainArtifact = data;
      App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
      App.contracts.SupplyChain.setProvider(App.web3Provider);

      // App.fetchItemBufferOne();
      // App.fetchItemBufferTwo().then(() => {
      // });
      App.fetchEvents();
    });

    return App.bindEvents();
  },

  bindEvents: function () {
    $(document).on("click", App.handleButtonClick);
  },

  handleButtonClick: async function (event) {
    App.getMetaskAccountID();

    var processId = parseInt($(event.target).data("id"));
    console.log("processId", processId);

    if (processId == 1) {
      //harvest product. make sure image is uploaded first.
      if ($("#product_pic").val().length == 0) {
        alert("Please upload product image");
        return;
      }
      App.uploadPicToIpfs(event);
      return;
    }
    //1001 is the id of anchor tag which has uploaded image ipfs link.
    //1002 is the id of browse file input. so let both of these ids do thier default behaviour.
    if (processId !== 1001 && processId !== 1002) {
      event.preventDefault();
    }
    switch (processId) {
      case 2:
        return await App.processItem(event);
        break;
      case 3:
        return await App.packItem(event);
        break;
      case 4:
        return await App.sellItem(event);
        break;
      case 5:
        return await App.buyItem(event);
        break;
      case 6:
        return await App.shipItem(event);
        break;
      case 7:
        return await App.receiveItem(event);
        break;
      case 8:
        return await App.purchaseItem(event);
        break;
      case 9:
        return await App.fetchItemBufferOne(event);
        break;
      case 10:
        return await App.fetchItemBufferTwo(event);
        break;
    }
  },

  harvestItem: function (event, ipfsUploadedFileHash) {
    event.preventDefault();

    if (!ipfsUploadedFileHash || ipfsUploadedFileHash.length === 0) {
      alert("product image not uploaded to ipfs, please try again");
      return;
    }

    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        return instance.harvestItem(
          $("#newUPC").val(),
          App.metamaskAccountID,
          App.originFarmName,
          App.originFarmInformation,
          App.originFarmLatitude,
          App.originFarmLongitude,
          $("#productNotesNew").val(),
          ipfsUploadedFileHash
        );
      })
      .then(function (result) {
        $("#ftc-item").text(result);
        console.log("harvestItem", result);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  processItem: function (event) {
    event.preventDefault();
    var processId = parseInt($(event.target).data("id"));

    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        return instance.processItem($("#newUPC").val(), { from: App.metamaskAccountID });
      })
      .then(function (result) {
        $("#ftc-item").text(result);
        console.log("processItem", result);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  packItem: function (event) {
    event.preventDefault();
    var processId = parseInt($(event.target).data("id"));

    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        return instance.packItem($("#newUPC").val(), { from: App.metamaskAccountID });
      })
      .then(function (result) {
        $("#ftc-item").text(result);
        console.log("packItem", result);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  sellItem: function (event) {
    event.preventDefault();
    var processId = parseInt($(event.target).data("id"));

    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        const productPrice = web3.toWei($("#productPriceNew").val(), "ether");
        console.log("productPrice", productPrice);
        return instance.sellItem($("#newUPC").val(), productPrice, { from: App.metamaskAccountID });
      })
      .then(function (result) {
        $("#ftc-item").text(result);
        console.log("sellItem", result);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  buyItem: function (event) {
    event.preventDefault();
    var processId = parseInt($(event.target).data("id"));

    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        const walletValue = web3.toWei($("#productPrice").val(), "ether");
        return instance.buyItem($("#newUPC").val(), { from: App.metamaskAccountID, value: walletValue });
      })
      .then(function (result) {
        $("#ftc-item").text(result);
        console.log("buyItem", result);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  shipItem: function (event) {
    event.preventDefault();
    var processId = parseInt($(event.target).data("id"));

    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        return instance.shipItem($("#newUPC").val(), { from: App.metamaskAccountID });
      })
      .then(function (result) {
        $("#ftc-item").text(result);
        console.log("shipItem", result);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  receiveItem: function (event) {
    event.preventDefault();
    var processId = parseInt($(event.target).data("id"));

    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        return instance.receiveItem($("#newUPC").val(), { from: App.metamaskAccountID });
      })
      .then(function (result) {
        $("#ftc-item").text(result);
        console.log("receiveItem", result);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  purchaseItem: function (event) {
    event.preventDefault();
    var processId = parseInt($(event.target).data("id"));

    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        return instance.purchaseItem($("#newUPC").val(), { from: App.metamaskAccountID });
      })
      .then(function (result) {
        $("#ftc-item").text(result);
        console.log("purchaseItem", result);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  fetchItemBufferOne: async function () {
    await App.showLoading("Fetching Product Details By Fetch Data 1. (For upc = " + $("#upc").val() + " )");

    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        return instance.fetchItemBufferOne($("#upc").val());
      })
      .then(function (result) {
        console.log("fetchItemBufferOne", result);
        $("#sku2").val(result[0]);
        $("#newUPC2").val(result[1]);
        $("#ownerID2").val(result[2]);
        $("#originFarmerID2").val(result[3]);
        $("#originFarmName2").val(result[4]);
        $("#originFarmInformation2").val(result[5]);
        $("#originFarmLatitude2").val(result[6]);
        $("#originFarmLongitude2").val(result[7]);
        $("#productImgIpfsHash2").val(result[8]);

        let ipfsLink =
          "<a data-id='1001' target='_blank' href='https://gateway.ipfs.io/ipfs/" + result[8] + "'>https://gateway.ipfs.io/ipfs/" + result[8] + "</a>";
        $("#productImgLink2").html(ipfsLink);
        App.hideLoading();
        App.readPicFromIpfsViaInfura(result[8]);
      })
      .catch(function (err) {
        $(".clear-on-error").find("input:text").val("");
        console.log(err);
        App.hideLoading();
        App.parseError(err);
      });
  },

  fetchItemBufferTwo: async function () {
    await App.showLoading("Fetching Product Details By Fetch Data 2. (For upc = " + $("#upc").val() + " )");
    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        return instance.fetchItemBufferTwo.call($("#upc").val());
      })
      .then(function (result) {
        $("#ftc-item").text(result);
        console.log("fetchItemBufferTwo", result);
        for (const [key, value] of Object.entries(App.itemStates)) {
          if (key == result[5]) {
            result[5] = value;
            break;
          }
        }
        $("#newUPC2").val(result[1]);
        $("#productID2").val(result[2]);
        $("#productNotes2").val(result[3]);
        $("#productPrice2").val(web3.fromWei(result[4], "ether"));
        $("#itemState2").val(result[5]);
        $("#distributorID2").val(result[6]);
        $("#retailerID2").val(result[7]);
        $("#consumerID2").val(result[8]);
        App.hideLoading();
      })
      .catch(function (err) {
        $(".clear-on-error").find("input:text").val("");
        App.hideLoading();
        App.parseError(err);
      });
  },

  fetchEvents: function () {
    if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
      App.contracts.SupplyChain.currentProvider.sendAsync = function () {
        return App.contracts.SupplyChain.currentProvider.send.apply(App.contracts.SupplyChain.currentProvider, arguments);
      };
    }

    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        var events = instance.allEvents(function (err, log) {
          if (!err) {
            let msg = log.event + " - " + log.transactionHash;
            $("#ftc-events").append("<li>" + msg + "</li>");
            if (App.farmerEventArr.includes(log.event)) {
              App.setFarmerDetailStatus(
                "<span style='color:green'>Product is " + log.event + ". Successfully done. tx id : " + log.transactionHash + "</span>"
              );
            } else if (App.productDetailArr.includes(log.event)) {
              App.setProductDetailStatus(
                "<span style='color:green'>Product is " + log.event + ". Successfully done. tx id : " + log.transactionHash + "</span>"
              );
            }
          }
        });
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  uploadPicToIpfs: async function (event) {
    try {
      await App.showLoading("Uploading Image to IPFS....(For upc = " + $("#newUPC").val() + " )");

      let fileReader = new FileReader();
      fileReader.onload = () => {
        const loadedBuffer = buffer.Buffer(fileReader.result);
        App.ipfs.add(loadedBuffer, (err, result) => {
          let ipfsLink =
            "<a data-id='1001' target='_blank' href='https://gateway.ipfs.io/ipfs/" +
            result[0].hash +
            "'>https://gateway.ipfs.io/ipfs/" +
            result[0].hash +
            "</a>";
          $("#ipfs_file_link").html(ipfsLink);
          App.hideLoading();
          App.harvestItem(event, result[0].hash);
        });
      };
      fileReader.readAsArrayBuffer($("#product_pic")[0].files[0]);
    } catch (err) {
      App.hideLoading();
      alert(err);
    }
  },
  readPicFromIpfsViaInfura: async (ipfsFileHash) => {
    if (!ipfsFileHash || ipfsFileHash.length == 0) {
      alert("can not load ipfs file. hash is invalid or empty");
      return;
    }

    App.showLoading("Loading image from ipfs...");

    App.ipfs.cat(ipfsFileHash, (err, result) => {
      if (result) {
        var blob = new Blob([result]);
        $(".readPicFromIpfsViaInfura").remove();

        $("#productImgLink2Div").append("<p class='readPicFromIpfsViaInfura' >Below image is mannually read by infura ipfs gateway</p>");

        $("#productImgLink2Div").append(
          "<img class='readPicFromIpfsViaInfura' width='100%' height='50%' id='theImg' src='" + window.URL.createObjectURL(blob) + "'/>"
        );
      }
      App.hideLoading();
      $("html, body").animate({ scrollTop: $(document).height() }, 1000);
    });
  },
  setFarmerDetailStatus: (status) => {
    $("#farmerDetailStatus").html(status);
  },
  setProductDetailStatus: (status) => {
    $("#productDetailStatus").html(status);
  },

  showLoading: async (msg) => {
    $("#loadingId").html(msg);
    const intentionalDelay = (ms) => new Promise((res) => setTimeout(res, 1500)); //this not required
    $("body").addClass("loading");
    await intentionalDelay();
  },
  hideLoading: () => {
    $("#loadingId").html("");
    $("body").removeClass("loading");
  },

  parseError: (err) => {
    if (err && "data" in err) {
      if ("message" in err.data) alert(err.data.message);
    }else{
      alert(err);
    }
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
