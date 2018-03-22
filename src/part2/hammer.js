// 模型 json 数据
const HARMMER_JSON = {
  "metadata": {
    "generator": "io_three",
    "version": 3,
    "vertices": 96,
    "type": "Geometry",
    "materials": 3,
    "faces": 48
  },
  "faces": [3, 45, 42, 43, 44, 0, 3, 49, 46, 47, 48, 0, 3, 48, 47, 50, 51, 0, 3, 51, 50, 52, 53, 0, 3, 53, 52, 54, 55, 0, 3, 55, 54, 56, 57, 0, 3, 57, 56, 58, 59, 0, 3, 59, 58, 60, 61, 0, 3, 61, 60, 62, 63, 0, 2, 69, 3, 1, 0, 2, 1, 64, 19, 0, 2, 19, 17, 15, 0, 2, 15, 13, 11, 0, 2, 11, 9, 7, 0, 2, 7, 5, 29, 0, 2, 7, 29, 65, 0, 2, 15, 11, 7, 0, 2, 1, 19, 15, 0, 2, 67, 69, 1, 0, 2, 15, 7, 65, 0, 2, 67, 1, 15, 0, 2, 15, 65, 67, 0, 3, 63, 62, 21, 70, 0, 3, 70, 21, 42, 45, 0, 2, 20, 0, 2, 0, 2, 2, 71, 72, 0, 2, 74, 22, 4, 0, 2, 20, 2, 72, 0, 2, 74, 4, 6, 0, 2, 20, 72, 74, 0, 2, 16, 18, 20, 0, 2, 12, 14, 16, 0, 2, 8, 10, 12, 0, 2, 74, 6, 8, 0, 2, 16, 20, 74, 0, 2, 8, 12, 16, 0, 2, 74, 8, 16, 0, 3, 81, 76, 77, 79, 2, 3, 80, 78, 82, 84, 2, 3, 85, 83, 86, 87, 2, 3, 32, 36, 34, 30, 2, 3, 37, 33, 31, 35, 2, 3, 88, 75, 73, 90, 1, 3, 91, 23, 68, 92, 1, 3, 93, 24, 66, 94, 1, 3, 95, 28, 27, 89, 1, 3, 39, 41, 40, 38, 1, 3, 43, 26, 25, 44, 0],
  "vertices": [-0.15, 1.2941, 3.40612, 0.15, 1.2941, 3.40612, -0.128331, 0.794995, 3.59434, 0.128331, 0.794995, 3.59434, -0.128331, 0.794995, 4.50961, 0.128331, 0.794995, 4.50961, -0.15, 1.2941, 4.69782, 0.15, 1.2941, 4.69782, -0.15, 1.59847, 4.68031, 0.15, 1.59847, 4.68031, -0.15, 1.8565, 4.57849, 0.15, 1.8565, 4.57849, -0.15, 2.02892, 4.35421, 0.15, 2.02892, 4.35421, -0.15, 2.08946, 4.05197, 0.15, 2.08946, 4.05197, -0.15, 2.02892, 3.74974, 0.15, 2.02892, 3.74974, -0.15, 1.8565, 3.52545, 0.15, 1.8565, 3.52545, -0.15, 1.59847, 3.42363, 0.15, 1.59847, 3.42363, -0.15, 0.242121, 4.1, -0.15, 1.3, 4, 0.15, 1.3, 4, -0.15, 0.242121, 4, 0.15, 0.242121, 4, -0.15, 1.3, 4.1, 0.15, 1.3, 4.1, 0.15, 0.242121, 4.1, -0.1, -0.1, 4, -0.1, 0.0999995, 4, -0.1, -0.1, -1.19209e-08, -0.1, 0.1, 1.19209e-08, 0.1, -0.1, 4, 0.1, 0.0999995, 4, 0.1, -0.1, -1.19209e-08, 0.1, 0.1, 1.19209e-08, -0.15, -0.7, 4.1, -0.15, -0.7, 4, 0.15, -0.7, 4.1, 0.15, -0.7, 4, 0.15, 1.2941, 3.40612, 0.128331, 0.794995, 3.59434, -0.128331, 0.794995, 3.59434, -0.15, 1.2941, 3.40612, 0.15, 0.242121, 4.1, 0.128331, 0.794995, 4.50961, -0.128331, 0.794995, 4.50961, -0.15, 0.242121, 4.1, 0.15, 1.2941, 4.69782, -0.15, 1.2941, 4.69782, 0.15, 1.59847, 4.68031, -0.15, 1.59847, 4.68031, 0.15, 1.8565, 4.57849, -0.15, 1.8565, 4.57849, 0.15, 2.02892, 4.35421, -0.15, 2.02892, 4.35421, 0.15, 2.08946, 4.05197, -0.15, 2.08946, 4.05197, 0.15, 2.02892, 3.74974, -0.15, 2.02892, 3.74974, 0.15, 1.8565, 3.52545, -0.15, 1.8565, 3.52545, 0.15, 1.59847, 3.42363, 0.15, 1.3, 4.1, 0.15, 1.3, 4.1, 0.15, 1.3, 4, 0.15, 1.3, 4, 0.15, 0.242121, 4, -0.15, 1.59847, 3.42363, -0.15, 0.242121, 4, -0.15, 1.3, 4, -0.15, 1.3, 4, -0.15, 1.3, 4.1, -0.15, 1.3, 4.1, -0.1, 0.0999995, 4, -0.1, 0.1, 1.19209e-08, -0.1, 0.1, 1.19209e-08, -0.1, -0.1, -1.19209e-08, -0.1, -0.1, -1.19209e-08, -0.1, -0.1, 4, 0.1, 0.1, 1.19209e-08, 0.1, 0.1, 1.19209e-08, 0.1, -0.1, -1.19209e-08, 0.1, -0.1, -1.19209e-08, 0.1, 0.0999995, 4, 0.1, -0.1, 4, -0.15, -0.7, 4.1, -0.15, -0.7, 4.1, -0.15, -0.7, 4, -0.15, -0.7, 4, 0.15, -0.7, 4, 0.15, -0.7, 4, 0.15, -0.7, 4.1, 0.15, -0.7, 4.1],
  "materials": [{
    "blending": 1,
    "colorSpecular": [0.5, 0.5, 0.5],
    "depthWrite": true,
    "shading": "phong",
    "DbgName": "Material.002",
    "opacity": 1,
    "DbgIndex": 0,
    "doubleSided": false,
    "visible": true,
    "depthTest": true,
    "colorDiffuse": [0.64, 0.64, 0.64],
    "wireframe": false,
    "colorEmissive": [0, 0, 0],
    "DbgColor": 15658734,
    "specularCoef": 50,
    "transparent": false
  }, {
    "blending": 1,
    "colorSpecular": [0.5, 0.5, 0.5],
    "depthWrite": true,
    "shading": "phong",
    "DbgName": "Material.001",
    "opacity": 1,
    "DbgIndex": 1,
    "doubleSided": false,
    "visible": true,
    "depthTest": true,
    "colorDiffuse": [0.000677524, 0.00230334, 0.64],
    "wireframe": false,
    "colorEmissive": [0, 0, 0],
    "DbgColor": 15597568,
    "specularCoef": 50,
    "transparent": false
  }, {
    "blending": 1,
    "colorSpecular": [0.5, 0.5, 0.5],
    "depthWrite": true,
    "shading": "phong",
    "DbgName": "Material.003",
    "opacity": 1,
    "DbgIndex": 2,
    "doubleSided": false,
    "visible": true,
    "depthTest": true,
    "colorDiffuse": [0.64, 0, 0.00368193],
    "wireframe": false,
    "colorEmissive": [0, 0, 0],
    "DbgColor": 60928,
    "specularCoef": 50,
    "transparent": false
  }]
}

export default class Mod {
  constructor() {
    this.init.apply(this, arguments);

    return this;
  }

  init(option) {
    let self = this;

    self.option = Object.assign({
      gap: 45, // 旋转最大幅度
      rate: 3, // 旋转幅度 (角度)
      x: 0,
      y: 0,
      z: 0,
      xr: 0, // 初始角度
      yr: 0, // 初始角度
      zr: 0, // 初始角度
      scale: 90
    }, option);

    // 转换角度
    self.option.gap = self.parseAngle(self.option.gap);
    self.option.rate = self.parseAngle(self.option.rate);
    self.option.xr = self.parseAngle(self.option.xr);
    self.option.yr = self.parseAngle(self.option.yr);
    // self.option.zr = self.parseAngle(self.option.zr);

    self.flag = true; // 正负方向偏移标记
    self.count = 0; // 记录变换次数

    // 解析模型数据, 返回模型&材质
    let modelLoader = new THREE.JSONLoader();
    let obj = modelLoader.parse(HARMMER_JSON, 'hammer');
    self.geometry = obj.geometry;
    self.materials = obj.materials;

    // 生成模型
    let mesh = new THREE.Mesh(self.geometry, self.materials);

    // 旋转方向
    let s = self.option.scale;
    mesh.scale.set(s, s, s);

    let xr = self.option.xr;
    let yr = self.option.yr;
    let zr = self.option.zr;

    // 防止死锁
    if (zr === 90 || zr === 270) {
      zr += 1;
    }

    zr = self.parseAngle(zr);

    mesh.rotation.set(xr, yr, zr);

    // 设置位移
    let x = self.option.x;
    let y = self.option.y;
    let z = self.option.z;
    mesh.position.set(x, y, z);

    self.mesh = mesh;
  }

  // 步进动画
  anim() {
    let self = this;
    let hammer = self.mesh;

    let xr = self.option.xr;
    let zr = self.option.zr;

    let gap = self.option.gap;
    let rate = self.option.rate;

    let rotation = hammer.rotation;

    if (self.flag) {
      hammer.rotateX(-rate);
    } else {
      hammer.rotateX(rate);
    }

    if (zr >= 90 && zr < 270) {
      if (rotation.x >= xr + gap || rotation.x <= xr) {
        self.flag = !self.flag;
        self.count++;
      }
    } else {
      if (rotation.x >= xr || rotation.x <= xr - gap) {
        self.flag = !self.flag;
        self.count++;
      }
    }

    if (self.count > 1) {
      self.anim = () => {};
      return;
    }
  }

  parseAngle(angle) {
    return angle / 180 * Math.PI;
  }
};
