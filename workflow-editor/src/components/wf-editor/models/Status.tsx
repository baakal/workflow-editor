import { Group } from "konva/types/Group";
import Konva from "konva";
import { Rect } from "konva/types/shapes/Rect";
import { dist } from "../../../utils/utils";
import { _Action } from "./Actions";
import { Design } from "./Design";

export interface _Status{
  name: string;
  Description?:string;
  Actions?:_Action[];
  Actors?:string[];
  Options?:any;
  Design?:Design;
}

export class Status implements _Status{
   
     private _statusGroup:Group;
     public name: string;
      Description?:string;
      Actions?:_Action[];
      Actors?:string[];
      Options?:any;
      Design?:Design;
    constructor(name:string,data?:any){
        this.name= name;
        this.Description = !!data?.Description?data.Description:"...";
        this.Actions = !!data?.Actions?data.Actions:[];
        this.Actors = !!data?.Actors?data.Actors:[];
        this.Options = !!data?.Options?data.Options:{};
        this.Design = !!data?.Design?data.Design:new Design(10,10);
    }

    getStatus(main:Group): Group{  
      if(!this._statusGroup){
        var that = this;

        let minx:number = main.getStage().width();
        let miny:number = main.getStage().height();
        var w = 120;
        var h = 60;
        var p = 10;
        
        var group = new Konva.Group({
          x:that.Design.x,
          y:that.Design.y,
          name:'status-group',
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
          text:that.name,
          fontsize:20,
          fontFamily:"sans-serif",
          fontStyle:"bold",
          fill:'#000'
          
        })
        group.add(name);
    
        let description = new Konva.Text({
          x: name.x(),
          y: name.x()+name.height()+5,
          width:card.width(),
          height:name.height()*2,
          text:that.Description,
          fontsize:90,
          fontFamily:"Roboto",
          fill:'#000'
          
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
        
        group.on('mouseover', ()=>{
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
          let main = (arrowEdge.findAncestor('.main') as Group);
          main.find('.status-group').each(function (c) {
            // do not check intersection with itself    
            var child = c as Group; 
            var target =  (child.findOne('.card') as Rect);
    
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

        main.find('.status-group').each(function (child:Group) {
          // do not check intersection with itself    
        
          if (group === child) {
            return;
          } 
          if (haveIntersection(group, child)) {
          
            if(group.y()+ 150 > miny)
            {
              group.x(child.x()+250);
              group.y(0);
            }
            else{
             group.y(child.y()+ 100);
            }
          } 
          // do not need to call layer.draw() here
          // because it will be called by dragmove action
        });
        
        
        arrowEdge.on('dragend',(e)=>{
          let arrowEdge = e.target;
          let original = group.findOne('.card');
          let main = (arrowEdge.findAncestor('.main') as Group);
          
       
          main.find('.status-group').each(function (c) {
            // do not check intersection with itself    
            var child = c as Group; 
            var target =  (child.findOne('.card') as Rect);
    
            console.log(group,child);
            target.shadowColor('#000');
            if (target === card||!target) {
              return;
            } 
            if (haveIntersection(arrowEdge, target)) {
              console.log(group,child);
              Status.connectStatus("action",group,child);
            }
          });  
          arrowEdge.position({x:boundary.width()-10 ,y:boundary.height()/2 });
       
          arrow.points([original.width()+p +4,boundary.height()/2,boundary.width()-2 ,boundary.height()/2 ]);
          group.findAncestor('.main').draw();
        });
        group.on('dragmove',()=>{
          that.Design.x = group.x();
          that.Design.y = group.y();

        })
        this._statusGroup = group;
      }
      return this._statusGroup;
    }

    addAction(name:string,to:Status){
      Status.connectStatus(name,this._statusGroup,to._statusGroup);
    }
    
    private haveIntersection(r1, r2):boolean {
      return !(
        r1.absolutePosition().x > r2.absolutePosition().x + r2.width() ||
        r1.absolutePosition().x + r1.width() < r2.absolutePosition().x ||
        r1.absolutePosition().y > r2.absolutePosition().y + r2.height() ||
        r1.absolutePosition().y + r1.height() < r2.absolutePosition().y
      ); 
    }
    
    public static connectStatus(name:string,from:Group, to:Group){
  

        let path ='<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><title>box-configurator-edit</title><circle cx="8" cy="8" r="8" style="fill:#fff"/><path d="M10.6,7.5c-0.2,0.8-0.6,1.5-1.2,2c-0.1,0.1-0.2,0.1-0.3,0L8.2,9C7.8,9.3,7.4,9.6,6.9,9.8v1.1c0,0.1-0.1,0.2-0.2,0.3c-0.8,0.2-1.6,0.2-2.3,0c-0.1,0-0.2-0.1-0.2-0.3V9.8C3.6,9.6,3.2,9.3,2.8,9L1.9,9.5c-0.1,0.1-0.2,0-0.3,0c-0.5-0.6-0.9-1.3-1.2-2c0-0.1,0-0.2,0.1-0.3l0.9-0.5c-0.1-0.5-0.1-1,0-1.5L0.5,4.6C0.4,4.5,0.4,4.4,0.4,4.3c0.2-0.8,0.6-1.5,1.2-2c0.1-0.1,0.2-0.1,0.3,0l0.9,0.5C3.2,2.4,3.6,2.2,4.1,2V0.9c0-0.1,0.1-0.2,0.2-0.3c0.7-0.2,1.6-0.2,2.3,0c0.1,0,0.2,0.1,0.2,0.3V2c0.5,0.2,0.9,0.4,1.3,0.8l0.9-0.5c0.1-0.1,0.2,0,0.3,0c0.5,0.6,0.9,1.3,1.2,2c0,0.1,0,0.2-0.1,0.3L9.6,5.1c0.1,0.5,0.1,1,0,1.5l0.9,0.5C10.6,7.2,10.6,7.3,10.6,7.5z M7.2,5.9c0-0.9-0.8-1.7-1.7-1.7S3.8,4.9,3.8,5.9s0.8,1.7,1.7,1.7S7.2,6.8,7.2,5.9z"/></svg>';
        let w =80;
        let h = 30;
        let findnearest =  (from:Group,to:Group)=>{
          let anchorFroms = [
            {
              x:from.getAbsolutePosition().x,
              xa:from.width()/2-10,
              y:from.getAbsolutePosition().y,
              ya:10,
            },
            {
              x:from.getAbsolutePosition().x,
              xa:from.width()-20,
              y:from.getAbsolutePosition().y,
              ya:from.height()/2
            },
            {
              x:from.getAbsolutePosition().x,
              xa:from.width()/2-10,
              y:from.getAbsolutePosition().y,
              ya:from.height()-10
            },
            {
              x:from.getAbsolutePosition().x,
              xa:10,
              y:from.getAbsolutePosition().y,
              ya:from.height()/2
            }
          ];
      
          let anchorTos = [
            {
              x:to.getAbsolutePosition().x,
              xa:to.width()/2-10,
              y:to.getAbsolutePosition().y,
              ya:10
            },
            {
              x:to.getAbsolutePosition().x,
              xa:to.width()-20,
              y:to.getAbsolutePosition().y,
              ya:to.height()/2
            },
            {
              x:to.getAbsolutePosition().x,
              xa:to.width()/2-10,
              y:to.getAbsolutePosition().y,
              ya:to.height()-10
            },
            {
              x:to.getAbsolutePosition().x,
              xa:10,
              y:to.getAbsolutePosition().y,
              ya:to.height()/2
            }
          ];
          
          let anchors =[anchorFroms[0],anchorTos[0]];
          let distance = dist(anchorFroms[0],anchorTos[0]);
          anchorFroms.forEach(aFrom => {
              anchorTos.forEach(aTo =>{
                let d = dist(aFrom,aTo);
                if(distance>d){
                  anchors = [aFrom,aTo];
                  distance = d;
                }
              }); 
          });
          return anchors;
        };
    
        let anchors = findnearest(from,to);
    
        let group = new Konva.Group({
          x: 10,
          y: 10,
          draggable:true,
          dragBoundFunc:function(pos){
            return{ x:this.absolutePosition().x,y: pos.y}
          }
        }); 
        let anchorFrom = new Konva.Circle({
          radius:3,
          x:anchors[0].xa,
          y:anchors[0].ya,
          draggable: false
          
        })
        from.add(anchorFrom);
        
        let anchorTo = new Konva.Circle({
          radius:3,
          x:anchors[1].xa,
          y:anchors[1].ya,
          draggable: false
        })
        to.add(anchorTo);
        
    
        let arrow = new Konva.Arrow({
          name:'status-arrow',
          x: -10,
          y: -10,
          points: [anchorFrom.getAbsolutePosition().x-10,anchorFrom.getAbsolutePosition().y-10,
                   anchorTo.getAbsolutePosition().x-10,anchorTo.getAbsolutePosition().y-10],
          pointerLength: 7,
          pointerWidth: 7,
          fill:'white',
          stroke: '#6D5CE8',
          strokeWidth: 2,
        });
        group.add(arrow);
        
        var actionGroup = new Konva.Group({
          x:anchorFrom.getAbsolutePosition().x-10 + (anchorTo.getAbsolutePosition().x-10 - anchorFrom.getAbsolutePosition().x-10)/2 - w/2,
          y:anchorFrom.getAbsolutePosition().y-10 + (anchorTo.getAbsolutePosition().y-10 - anchorFrom.getAbsolutePosition().y-10)/2 - h/2,
          draggable:false,
        });
        var action = new Konva.Rect({
          x: 0,
          y: 0,
          width: w,
          height: h,
          fill: '#757de8',
          
        shadowBlur: 2,
        cornerRadius: 10,
          draggable:false,

        });
        // var icon = new Konva.Path({
        //   x:0,
        //   y:0,
        //   data: path,
        //   fill:'#000'}
        // );
        let actionText = new Konva.Text({
          x:0,
          y:0,
          width:action.width(),
          height:action.height(),
          text:name,
          fontsize:10,
          fontStyle:"bold",
          fill:'#FFF',
          align:'center',
          verticalAlign: 'middle',
          
        });
        actionGroup.add(action);
        actionGroup.add(actionText);
        // actionGroup.add(icon);
        group.add(actionGroup);
        var main = (from.findAncestor('.main') as Group)
        main.add(group);
        main.findAncestor('.main-layer').draw();
    
        from.on('dragmove',()=>{
          let anchors = findnearest(from,to);
          anchorFrom.x(anchors[0].xa);
          anchorFrom.y(anchors[0].ya);
          anchorTo.x(anchors[1].xa);
          anchorTo.y(anchors[1].ya);
          actionGroup.x(anchorFrom.getAbsolutePosition().x-10 +(anchorTo.getAbsolutePosition().x-10 - anchorFrom.getAbsolutePosition().x-10)/2 - w/2);
          actionGroup.y(anchorFrom.getAbsolutePosition().y-10 +(anchorTo.getAbsolutePosition().y-10 - anchorFrom.getAbsolutePosition().y-10)/2 - h/2);
          arrow.points([anchorFrom.getAbsolutePosition().x-10,anchorFrom.getAbsolutePosition().y-10,
                        anchorTo.getAbsolutePosition().x-10,anchorTo.getAbsolutePosition().y-10])
        });
        to.on('dragmove',()=>{
          
          let anchors = findnearest(from,to);
          anchorFrom.x(anchors[0].xa);
          anchorFrom.y(anchors[0].ya);
          anchorTo.x(anchors[1].xa);
          anchorTo.y(anchors[1].ya);
          actionGroup.x(anchorFrom.getAbsolutePosition().x-10 -(anchorFrom.getAbsolutePosition().x-10 - anchorTo.getAbsolutePosition().x-10)/2);
          actionGroup.y(anchorFrom.getAbsolutePosition().y-10 -(anchorFrom.getAbsolutePosition().y-10 - anchorTo.getAbsolutePosition().y-10)/2);
          arrow.points([anchorFrom.getAbsolutePosition().x-10,anchorFrom.getAbsolutePosition().y-10,
                   anchorTo.getAbsolutePosition().x-10,anchorTo.getAbsolutePosition().y-10])
        });
    }
    public toJSON(){
      let obj:_Status = {
        name: this.name,
        Description: this.Description, 
        Actions: this.Actions, 
        Actors: this.Actors,
        Options: this.Options, 
        Design: this.Design,

      }; 
      return obj;

    }
}

