function generateCodeFromBlocks(block, indent = 0) {
  const tab = 2;
  const space = ' '.repeat(indent);
  
  const handlers = {
    // 处理入口文件
    '当开始运行'(block) {
      const next = generateCodeFromBlocks(block.next, indent + tab);
      return `${space}当开始运行(() => {\n${next}\n${space}});`;
    },

    
    '永远循环'(block) {
      const statements = generateCodeFromBlocks(block.statements.DO, indent + tab);
      return `${space}永远循环(() => {\n${statements}\n${space}});`;
    },

  
    '如果'(block) {
      const condition = generateCodeFromBlocks(block.inputs.IF0, indent);
      const doBlock = generateCodeFromBlocks(block.statements.DO0, indent + tab);
      const elseBlock = generateCodeFromBlocks(block.statements.ELSE, indent + tab);
      
      return [
        `${space}if (${condition}) {`,
        doBlock,
        `${space}} else {`,
        elseBlock,
        `${space}}`
      ].join('\n');
    },

    
    '判断角色碰撞'(block) {
      const sprite = block.fields.sprite;
      const sprite1 = block.fields.sprite1;
      return `判断角色碰撞("${sprite}", "${sprite1}")`;
    },

    
    '移动步数'(block) {
      const steps = generateCodeFromBlocks(block.inputs.steps, indent);
      return `${space}移动步数(${steps});`;
    },

    
    '移到位置'(block) {
      const x = generateCodeFromBlocks(block.inputs.x, indent);
      const y = generateCodeFromBlocks(block.inputs.y, indent);
      return `${space}移到位置(${x}, ${y});`;
    },

    
    'math_number'(block) {
      return block.fields.NUM;
    }
  };

  const handler = handlers[block.type];
  return handler ? handler(block) : '';
}

const blockData = {
  "type": "当开始运行",
  "next": {
    "type": "永远循环",
    "statements": {
      "DO": {
        "type": "如果",
        "inputs": {
          "IF0": {
            "type": "判断角色碰撞",
            "fields": {
              "sprite": "自己",
              "sprite1": "鼠标"
            },
            "is_output": true
          }
        },
        "statements": {
          "DO0": {
            "type": "移动步数",
            "inputs": {
              "steps": {
                "type": "math_number",
                "fields": {
                  "NUM": 10
                },
                "is_output": true
              }
            }
          },
          "ELSE": {
            "type": "移到位置",
            "inputs": {
              "x": {
                "type": "math_number",
                "fields": {
                  "NUM": 0
                },
                "is_output": true
              },
              "y": {
                "type": "math_number",
                "fields": {
                  "NUM": -100
                },
                "is_output": true
              }
            }
          }
        }
      }
    }
  }
};
const generatedCode = generateCodeFromBlocks(blockData);
console.log(generatedCode===`当开始运行(() => {
  永远循环(() => {
    if (判断角色碰撞("自己", "鼠标")) {
      移动步数(10);
    } else {
      移到位置(0, -100);
    }
  });
});`);