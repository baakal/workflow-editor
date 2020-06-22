import { Component, h,Element } from '@stencil/core';
import Konva from 'konva';
import { Stage } from 'konva/types/Stage';
import { Layer } from 'konva/types/Layer';
import { Group } from 'konva/types/Group';

@Component({
  tag: 'wf-editor',
  styleUrl: 'wf-editor.css',
  shadow: false,
})
export class WfEditor {

  @Element() wfContainerEl: HTMLElement;
  container: HTMLDivElement;
  stage: Stage;
  main: Group;
  mainLayer:Layer;
  backgroundLayer: Layer;
  stageWidth:number;
  stageHeight:number;
  scale:number;
  blockSnapSize:number = 20;

  private fitStageIntoParentContainer() {

    // now we need to fit stage into parent
    var containerWidth = this.container.offsetWidth;
    // to do this we need to scale the stage
    this.scale = containerWidth / this.stageWidth;
    this.stage.width(this.stageWidth * this.scale);
    this.stage.height(this.stageWidth * this.scale/2);
    this.scale=this.scale;
    this.stage.scale({ x: this.scale, y: this.scale });
    this.stage.draw();
  }

  private getGridLayer(): Layer{
    let gridLayer = new Konva.Layer();
    let backgroundColor = '#F1F3F4';
    let gridColor = '#333333';
    let background = new Konva.Rect({
      x: 5,
      y: 5,
      width: this.stageWidth,
      height: this.stageHeight,
      fill: backgroundColor,
      stroke: gridColor,
      shadowBlur: 5,
    });

    gridLayer.add(background);
    
    // let padding = this.blockSnapSize;
    // for (var i = 0; i < this.stageWidth / padding; i++) {
    //       gridLayer.add(new Konva.Line({
    //         points: [5+Math.round(i * padding) + 0.5, 5, 5+Math.round(i * padding) + 0.5, 5+this.stageHeight],
    //         stroke: gridColor,
    //         strokeWidth: 0.5,
    //     }));}

    
    // for (var j = 0; j < this.stageHeight / padding; j++) {
    //   gridLayer.add(new Konva.Line({
    //     points: [5, Math.round(j * padding)+5, 5+this.stageWidth, 5+Math.round(j * padding)],
    //     stroke: gridColor,
    //     strokeWidth: 0.5,
    //   }));
    // }
    return gridLayer;

  }

  
  private prepareStage() {
    this.container = (this.wfContainerEl.getElementsByClassName('wf-container')[0] as HTMLDivElement);
    this.stageWidth = 1700;
    this.stageHeight = 900;

    this.stage = new Konva.Stage({
      container: this.container,
      width: this.stageWidth+10,
      height: this.stageHeight+10,
    });
    this.backgroundLayer = this.getGridLayer();

    // add the layer to the stage
    this.stage.add(this.backgroundLayer);
  }

 
  
  getStatus():Group{  
   
    var w = 120;
    var h = 60;
    var p = 10;

    var group = new Konva.Group({
      name:'status',
      width:w+p*3,
      height:h+p*2,
      draggable:true,
      dragBoundFunc:function(pos){
        var x = pos.x;
        var y = pos.y;
        if (pos.x < 0) {
          x=this.getParent().absolutePosition().x
        }
        else if(pos.x>(minx - w)){
           x=minx-w;
        }

        if (pos.y < 0) {
          y=this.getParent().absolutePosition().y
        }
        else if(pos.y-(miny - h)>0){
           y=miny - h;
        }

        return{ x:x,y:y}
      }
    });

    let boundary =new Konva.Rect({
      name: 'boundary',
      x: 0,
      y: 0,
      width: group.width(),
      height: group.height(),
    });
    group.add(boundary);

    let card =new Konva.Rect({
      name: 'card',
      x: 10,
      y: 10,
      width: 120,
      height: 60,
      fill: '#FFF',
      shadowBlur: 5,
      cornerRadius: 5,
    
    });
    group.add(card);

    let name = new Konva.Text({
      x:15,
      y:15,
      width:card.width()-10,
      height:15,
      text:'Status Name',
      fontsize:10,
      fill:'#CCCCCC'
      
    })
    group.add(name);

    let description = new Konva.Text({
      x: name.x(),
      y: name.x()+name.height()+5,
      width:card.width(),
      height:name.height()*2,
      text:'Description....',
      fontsize:8,
      fill:'#D9D9D9'
      
    });
    group.add(description);
    
    let arrowStart = new Konva.Circle({
      name: 'arrow-start',
      radius: 3,
      x: card.width()+p +3,
      y:  boundary.height()/2,
      stroke:'#6D5CE8',
    });
    group.add(arrowStart);
    
    let arrow = new Konva.Arrow({
      name:'status-arrow',
      x: 0,
      y: 0,
      points: [arrowStart.x()+4,boundary.height()/2,boundary.width()-2 ,boundary.height()/2],
      pointerLength: 7,
      pointerWidth: 7,
      fill:'white',
      stroke: '#6D5CE8',
      strokeWidth: 2,
    });
    arrow.hide();
    arrowStart.hide();
    group.add(arrow);

    let arrowEdge = new Konva.Circle({
      radius: 10,
      x: boundary.width()-10,
      y:  boundary.height()/2,
      draggable:true
    });
    group.add(arrowEdge);
    
    group.on('mouseover', function () {
      document.body.style.cursor = 'move';
      group.findOne('.arrow-start').show();
      group.findOne('.status-arrow').show();
      group.findAncestor('Layer').draw();
    });

    group.on('mouseout', function () {
      document.body.style.cursor = 'default';
      group.findOne('.arrow-start').hide();
      group.findOne('.status-arrow').hide();
      group.findAncestor('Layer').draw();
    }); 

    var haveIntersection = this.haveIntersection;
    arrowEdge.on('dragStart',()=>{

      
      arrowStart.show();
      arrow.show();
      arrow.points([arrowStart.x()+4,arrowStart.y(),arrowEdge.x() ,arrowEdge.y() ]);
      
      let main = arrowEdge.findAncestor('.main');
      main.children.each(function (child) {

        var target =  child.findOne('.card');
        // do not check intersection with itself     
        if (target === card) {
          return;
        } 
        child.moveToBottom()
        if (haveIntersection(arrowEdge, target)) {
          target.shadowColor('blue');
        } else {
          target.shadowColor('#000');
        }
      });
    });

    arrowEdge.on('dragmove', (e) => {
      let arrowEdge = e.target;
      arrowStart.show();
      arrow.show();
      arrow.points([arrowStart.x()+4,arrowStart.y(),arrowEdge.x() ,arrowEdge.y() ]);
      

      let main = arrowEdge.findAncestor('.main');
      main.children.each(function (child) {
        // do not check intersection with itself     

        var target =  child.findOne('.card');

        if (target === card) {
          return;
        } 
        child.moveToBottom()
        if (haveIntersection(arrowEdge, target)) {
          target.shadowColor('blue');
        } else {
          target.shadowColor('#000');
        }
        // do not need to call layer.draw() here
        // because it will be called by dragmove action
      });
      // layer.draw();

    });
    
    arrowEdge.on('dragend',(e)=>{
      let arrowEdge = e.target;
      let original = group.findOne('.card');

      arrowEdge.position({x:boundary.width()-10 ,y:boundary.height()/2 });
      arrow.points([original.width()+p +4,boundary.height()/2,boundary.width()-2 ,boundary.height()/2 ]);
      let main = arrowEdge.findAncestor('.main');
      main.children.each(function (child) {
        // do not check intersection with itself     
        var target =  child.findOne('.card');

        target.shadowColor('#000');
        if (target === card) {
          return;
        } 
        if (haveIntersection(arrowEdge, target)) {
          this.connectStatus(group,child);
      }
      });

      group.findAncestor('.main').draw();
    });

    return group;
  }

  connectStatus(from:Group, to:Group){


    
    let group = new Konva.Group({
      x: 10,
      y: 10,
      draggable:true,
      dragBoundFunc:function(pos){
        return{ x:this.absolutePosition().x,y: pos.y}
      }
    }); 
    let fromCard = from.findOne('.card');
    let fromBoundary = from.findOne('.boundary');
    
    let toCard = to.findOne('.card');
    let toBoundary = to.findOne('.boundary');
    let arrowStart = new Konva.Circle({
      name: 'arrow-start',
      radius: 3,
      x: fromCard.width()+10+3,
      y:  fromBoundary.height()/2,
      stroke:'#6D5CE8',
    });
    group.add(arrowStart);
    
    let arrowEdge = new Konva.Circle({
      radius: 10,
      x: toCard.x(),
      y:  toCard.y()+toCard.height()/2,
      draggable:true
    });
    let arrow = new Konva.Arrow({
      name:'status-arrow',
      x: 0,
      y: 0,
      points: [arrowStart.x()+4,fromBoundary.height()/2,toCard.x()-2 ,toBoundary.height()/2],
      pointerLength: 7,
      pointerWidth: 7,
      fill:'white',
      stroke: '#6D5CE8',
      strokeWidth: 2,
    });
    group.add(arrow);
    group.add(arrowEdge);
    this.main.add(group);
    this.mainLayer.draw();
  }

  componentDidRender(){  
     
    this.prepareStage();
    this.mainLayer = new Konva.Layer({name:'main-layer'});
    this.main = new Konva.Group({
      name:'main',
      x:10,
      y:10,
    });
    let startStatus = this.getStatus();
    this.main.add(startStatus);
    let sample = this.getStatus()
    sample.x(500);
    this.main.add(sample);
    this.mainLayer.add(this.main);
    this.stage.add(this.mainLayer);
    // this.fitStageIntoParentContainer();
  }

  render() {
    return (
      <div class="wf-container"></div>    );
  }


  private haveIntersection(r1, r2):boolean {
    return !(
      r2.absolutePosition().x > r1.absolutePosition().x + r1.width() ||
      r2.absolutePosition().x + r2.width() < r1.absolutePosition().x ||
      r2.absolutePosition().y > r1.y + r1.height() ||
      r2.absolutePosition().y + r2.height() < r1.absolutePosition().y
    );
  }
}
