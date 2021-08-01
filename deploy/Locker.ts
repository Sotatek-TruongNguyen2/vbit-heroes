
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {
    expandTo18DecimalsRaw,
} from '../utils/utilities'
import settings from './settings/SettingsSecondYear.json';
import settingsV2 from './settings/SettingsThirdYear.json';

const deployLocker: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const {deployments, getNamedAccounts, ethers} = hre;
    const {deploy, execute} = deployments;
    const {deployer, dev} = await getNamedAccounts();

    const vbitAddress = (await deployments.get("VBitHeroes")).address;

    const gasPrice = expandTo18DecimalsRaw(settings.gasPrice, 9);

    const { address: vbitLocker1 } = await deploy('VBitHeroesLocker1', {
      from: deployer,
      args: [
        vbitAddress, 
        settings.start, 
        settings.end, 
        settings.merkleRoot
      ],
      contract: "VBitHeroesLocker",
      log: true,
      deterministicDeployment: false,
      gasPrice,
    });

    const { address: vbitLocker2 } = await deploy('VBitHeroesLocker2', {
      from: deployer,
      args: [
        vbitAddress, 
        settingsV2.start, 
        settingsV2.end, 
        settingsV2.merkleRoot
      ],
      contract: "VBitHeroesLocker",
      log: true,
      deterministicDeployment: false,
      gasPrice
    });

    await execute("VBitHeroes", { from: deployer, gasLimit: "300000", log: true }, "addLocker", "3", vbitLocker1);
    await execute("VBitHeroes", { from: deployer, gasLimit: "300000", log: true }, "addLocker", "4", vbitLocker2);
  };

deployLocker.dependencies = ["VBIT"];
deployLocker.tags = ["VBITLOCKER"];

export default deployLocker;