const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')
const OSS = require('ali-oss');
const pkg = require('./package.json')
const { env } = require('process');

const config = {
  Version: env['Version'],
  REGION: env['REGION'],
  ACCESSKEYID: env['ACCESSKEYID'],
  ACCESSKEYSECRET: env['ACCESSKEYSECRET'],
  BUCKETNAME: env['BUCKETNAME'],
  GitSHA: env["GIT_COMMIT"],
  ThreeJSTag: env["ThreeJSTag"],
  TrackerJSTag: env["TrackerJSTag"],
  APIKey: env['APIKey'],
  APISecret: env['APISecret'],
  SkipNpmPublish: env['skipNpmPublish'] === 'true',
};

const distPath = path.resolve(__dirname, 'build');

function checkAliOSSConfig(config) {
  const configItems = ['REGION', 'ACCESSKEYID', 'ACCESSKEYSECRET', 'BUCKETNAME']
  const notConfigured = [];
  configItems.forEach((item) => {
    if (!Object.keys(config).includes(item)) {
      notConfigured.push(item);
    }
  });

  if (notConfigured.length) {
    console.log(chalk.red(`检测到未进行配置: ${notConfigured}，请在环境变量中配置此项`))
    process.exit(4);
  }
}

function getOssJsFilePath(jsFileName) {
  return jsFileName;
}

function uploadAliOSS(config, uploadFileName) {
  console.log('上传阿里oss')
  checkAliOSSConfig(config);
  const {
    REGION, ACCESSKEYID, ACCESSKEYSECRET, BUCKETNAME,
  } = config;
  const localFilePath = (fileName) => `${path.resolve(distPath, fileName)}`;

  const client = new OSS({
    region: REGION,
    accessKeyId: ACCESSKEYID,
    accessKeySecret: ACCESSKEYSECRET,
    bucket: BUCKETNAME,
  });

  uploadFileName.forEach(async (file) => {
    try {
      const ossfile = getOssJsFilePath(file);
      const result = await client.put(`holodeck/js/${ossfile}`, localFilePath(file));
      if (result.res.status === 200) {
        console.log(chalk.white(`${chalk.bgBlue(ossfile)}    上传成功!`));
      }
    } catch (error) {
      console.log(chalk.red(`上传${file}出错::: ${error}`));
      process.exit(5);
    }
  });
}

const getRemoteTreeversion = () => {
  return new Promise((resolve, reject) => {
    exec(`npm view @oppentech/three | grep latest`, (err, res) => {
      const [_, version] = res.split(':')
      if (err) {
        reject(err)
      }
      resolve(version.trim())
    })
  })
}

const compareVersion = (version, otherVersion) => {
  const [major, mirror, patch] = version.split('.')
  const [otherMajor, otherMirror, otherPatch] = otherVersion.split('.')

  if (major > otherMajor || mirror > otherMirror || patch > otherPatch) {
    return true;
  }

  return false
}

const checkVersion = async onlineVersion => {
  console.log('检查版本号...')
  const { version: localVersion } = pkg
  const compareResult = compareVersion(localVersion, onlineVersion)
  if (!compareResult) {
    console.error(`本地版本过低: 线上: ${onlineVersion}, 本地: ${localVersion}`)
    process.exit(1);
  }
}

const checkDevDependencies = () => {
  return fs.existsSync(path.resolve(__dirname, 'node_modules'))
}

const getFileMD5 = (url) => {
  return new Promise((resolve, reject) => {
    exec(`md5 ${url}`, (err, res) => {
      if (err) {
        reject(err)
      }
      const [_, result] = res.split('=')
      const [splitResult] = result.trim().match(/.{8}/)
      resolve(splitResult)
    })
  })
}

const buildThreeJSBundle = () => {
  return new Promise((resolve, reject) => {
    let command = 'npm run build'
    console.log('构建中...')
    if (!checkDevDependencies()) {
      command = 'npm i && npm run build'
    }
    exec(command, (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  })
}

const hashFileGenerator = async () => {
  console.log('生成文件hash...')
  const threeBundlePath = path.resolve(__dirname, 'build', 'three.js');
  if (!threeBundlePath) {
    console.error('没有检测到生成文件')
    process.exit(2);
  }
  const md5 = await getFileMD5(threeBundlePath)
  return new Promise((resolve, reject) => {
    exec(`cp ${threeBundlePath} ${path.resolve(__dirname, 'build', 'three.' + md5 + '.js')}`, (err, res) => {
      if(err) {
        console.log(err);
        reject(err)
      }
      resolve(`three.${md5}.js`)
    })
  })
}



async function main() {
  const onlineVersion = await getRemoteTreeversion()
  checkVersion(onlineVersion)
  await buildThreeJSBundle()
  const hashedFile = await hashFileGenerator()
  uploadAliOSS(config, [hashedFile])
}

main()