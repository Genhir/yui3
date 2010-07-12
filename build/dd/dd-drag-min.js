YUI.add("dd-drag",function(D){var E=D.DD.DDM,U="node",G="dragging",N="dragNode",C="offsetHeight",K="offsetWidth",S="moveend",P="movestart",M="dragstart",H="drag:mouseDown",B="drag:afterMouseDown",F="drag:removeHandle",L="drag:addHandle",R="drag:removeInvalid",T="drag:addInvalid",J="drag:start",I="drag:end",O="drag:drag",Q="drag:align",A=function(W){this._lazyAddAttrs=false;A.superclass.constructor.apply(this,arguments);var V=E._regDrag(this);if(!V){D.error("Failed to register node, already in use: "+W.node);}};A.NAME="drag";A.ATTRS={node:{setter:function(V){var W=D.one(V);if(!W){D.error("DD.Drag: Invalid Node Given: "+V);}else{W=W.item(0);}return W;}},dragNode:{setter:function(V){var W=D.one(V);if(!W){D.error("DD.Drag: Invalid dragNode Given: "+V);}return W;}},offsetNode:{value:true},startCentered:{value:false},clickPixelThresh:{value:E.get("clickPixelThresh")},clickTimeThresh:{value:E.get("clickTimeThresh")},lock:{value:false,setter:function(V){if(V){this.get(U).addClass(E.CSS_PREFIX+"-locked");}else{this.get(U).removeClass(E.CSS_PREFIX+"-locked");}return V;}},data:{value:false},move:{value:true},useShim:{value:true},activeHandle:{value:false},primaryButtonOnly:{value:true},dragging:{value:false},parent:{value:false},target:{value:false,setter:function(V){this._handleTarget(V);return V;}},dragMode:{value:null,setter:function(V){return E._setDragMode(V);}},groups:{value:["default"],getter:function(){if(!this._groups){this._groups={};}var V=[];D.each(this._groups,function(X,W){V[V.length]=W;});return V;},setter:function(V){this._groups={};D.each(V,function(X,W){this._groups[X]=true;},this);return V;}},handles:{value:null,setter:function(V){if(V){this._handles={};D.each(V,function(X,W){var Y=X;if(X instanceof D.Node||X instanceof D.NodeList){Y=X._yuid;}this._handles[Y]=X;},this);}else{this._handles=null;}return V;}},bubbles:{setter:function(V){this.addTarget(V);return V;}}};D.extend(A,D.Base,{_bubbleTargets:D.DD.DDM,addToGroup:function(V){this._groups[V]=true;E._activateTargets();return this;},removeFromGroup:function(V){delete this._groups[V];E._activateTargets();return this;},target:null,_handleTarget:function(V){if(D.DD.Drop){if(V===false){if(this.target){E._unregTarget(this.target);this.target=null;}return false;}else{if(!D.Lang.isObject(V)){V={};}V.bubbleTargets=("bubbleTargets" in V)?V.bubbleTargets:D.Object.values(this._yuievt.targets);V.node=this.get(U);V.groups=V.groups||this.get("groups");this.target=new D.DD.Drop(V);}}else{return false;}},_groups:null,_createEvents:function(){this.publish(H,{defaultFn:this._defMouseDownFn,queuable:false,emitFacade:true,bubbles:true,prefix:"drag"});this.publish(Q,{defaultFn:this._defAlignFn,queuable:false,emitFacade:true,bubbles:true,prefix:"drag"});this.publish(O,{defaultFn:this._defDragFn,queuable:false,emitFacade:true,bubbles:true,prefix:"drag"});this.publish(I,{preventedFn:this._prevEndFn,queuable:false,emitFacade:true,bubbles:true,prefix:"drag"});var V=[B,F,L,R,T,J,"drag:drophit","drag:dropmiss","drag:over","drag:enter","drag:exit"];D.each(V,function(X,W){this.publish(X,{type:X,emitFacade:true,bubbles:true,preventable:false,queuable:false,prefix:"drag"});},this);},_ev_md:null,_startTime:null,_endTime:null,_handles:null,_invalids:null,_invalidsDefault:{"textarea":true,"input":true,"a":true,"button":true,"select":true},_dragThreshMet:null,_fromTimeout:null,_clickTimeout:null,deltaXY:null,startXY:null,nodeXY:null,lastXY:null,actXY:null,realXY:null,mouseXY:null,region:null,_handleMouseUp:function(V){this._fixIEMouseUp();if(E.activeDrag){E._end();}},_fixDragStart:function(V){V.preventDefault();},_ieSelectFix:function(){return false;},_ieSelectBack:null,_fixIEMouseDown:function(){if(D.UA.ie){this._ieSelectBack=D.config.doc.body.onselectstart;D.config.doc.body.onselectstart=this._ieSelectFix;}},_fixIEMouseUp:function(){if(D.UA.ie){D.config.doc.body.onselectstart=this._ieSelectBack;}},_handleMouseDownEvent:function(V){this.fire(H,{ev:V});},_defMouseDownFn:function(W){var V=W.ev;this._dragThreshMet=false;this._ev_md=V;if(this.get("primaryButtonOnly")&&V.button>1){}if(this.validClick(V)){this._fixIEMouseDown();V.halt();this._setStartPosition([V.pageX,V.pageY]);E.activeDrag=this;this._clickTimeout=D.later(this.get("clickTimeThresh"),this,this._timeoutCheck);}this.fire(B,{ev:V});},validClick:function(Z){var Y=false,c=false,V=Z.target,X=null,W=null,a=null,b=false;if(this._handles){D.each(this._handles,function(d,e){if(d instanceof D.Node||d instanceof D.NodeList){if(!Y){a=d;if(a instanceof D.Node){a=new D.NodeList(d._node);}a.each(function(f){if(f.contains(V)){Y=true;}});}}else{if(D.Lang.isString(e)){if(V.test(e+", "+e+" *")&&!X){X=e;Y=true;}}}});}else{c=this.get(U);if(c.contains(V)||c.compareTo(V)){Y=true;}}if(Y){if(this._invalids){D.each(this._invalids,function(d,e){if(D.Lang.isString(e)){if(V.test(e+", "+e+" *")){Y=false;}}});}}if(Y){if(X){W=Z.currentTarget.all(X);b=false;W.each(function(e,d){if((e.contains(V)||e.compareTo(V))&&!b){b=true;this.set("activeHandle",e);}},this);}else{this.set("activeHandle",this.get(U));}}return Y;},_setStartPosition:function(V){this.startXY=V;this.nodeXY=this.lastXY=this.realXY=this.get(U).getXY();if(this.get("offsetNode")){this.deltaXY=[(this.startXY[0]-this.nodeXY[0]),(this.startXY[1]-this.nodeXY[1])];}else{this.deltaXY=[0,0];}},_timeoutCheck:function(){if(!this.get("lock")&&!this._dragThreshMet){this._fromTimeout=this._dragThreshMet=true;this.start();this._alignNode([this._ev_md.pageX,this._ev_md.pageY],true);}},removeHandle:function(W){var V=W;if(W instanceof D.Node||W instanceof D.NodeList){V=W._yuid;}if(this._handles[V]){delete this._handles[V];this.fire(F,{handle:W});}return this;},addHandle:function(W){if(!this._handles){this._handles={};}var V=W;if(W instanceof D.Node||W instanceof D.NodeList){V=W._yuid;}this._handles[V]=W;this.fire(L,{handle:W});return this;},removeInvalid:function(V){if(this._invalids[V]){this._invalids[V]=null;delete this._invalids[V];this.fire(R,{handle:V});}return this;},addInvalid:function(V){if(D.Lang.isString(V)){this._invalids[V]=true;
this.fire(T,{handle:V});}return this;},initializer:function(V){this.get(U).dd=this;if(!this.get(U).get("id")){var W=D.stamp(this.get(U));this.get(U).set("id",W);}this.actXY=[];this._invalids=D.clone(this._invalidsDefault,true);this._createEvents();if(!this.get(N)){this.set(N,this.get(U));}this.on("initializedChange",D.bind(this._prep,this));this.set("groups",this.get("groups"));},_prep:function(){this._dragThreshMet=false;var V=this.get(U);V.addClass(E.CSS_PREFIX+"-draggable");V.on(P,D.bind(this._handleMouseDownEvent,this),{minDistance:this.get("clickPixelThresh"),minTime:this.get("clickTimeThresh")});V.on(S,D.bind(this._handleMouseUp,this));V.on(M,D.bind(this._fixDragStart,this));V.on("move",D.throttle(D.bind(E._move,E),E.get("throttleTime")));},_unprep:function(){var V=this.get(U);V.removeClass(E.CSS_PREFIX+"-draggable");V.detachAll();},start:function(){if(!this.get("lock")&&!this.get(G)){var W=this.get(U),V,X,Y;this._startTime=(new Date()).getTime();E._start();W.addClass(E.CSS_PREFIX+"-dragging");this.fire(J,{pageX:this.nodeXY[0],pageY:this.nodeXY[1],startTime:this._startTime});W=this.get(N);Y=this.nodeXY;V=W.get(K);X=W.get(C);if(this.get("startCentered")){this._setStartPosition([Y[0]+(V/2),Y[1]+(X/2)]);}this.region={"0":Y[0],"1":Y[1],area:0,top:Y[1],right:Y[0]+V,bottom:Y[1]+X,left:Y[0]};this.set(G,true);}return this;},end:function(){this._endTime=(new Date()).getTime();if(this._clickTimeout){this._clickTimeout.cancel();}this._dragThreshMet=false;this._fromTimeout=false;if(!this.get("lock")&&this.get(G)){this.fire(I,{pageX:this.lastXY[0],pageY:this.lastXY[1],startTime:this._startTime,endTime:this._endTime});}this.get(U).removeClass(E.CSS_PREFIX+"-dragging");this.set(G,false);this.deltaXY=[0,0];return this;},_prevEndFn:function(V){this.get(N).setXY(this.nodeXY);},_align:function(V){this.fire(Q,{pageX:V[0],pageY:V[1]});},_defAlignFn:function(V){this.actXY=[V.pageX-this.deltaXY[0],V.pageY-this.deltaXY[1]];},_alignNode:function(V){this._align(V);this._moveNode();},_moveNode:function(V){var W=[],X=[],Z=this.nodeXY,Y=this.actXY;W[0]=(Y[0]-this.lastXY[0]);W[1]=(Y[1]-this.lastXY[1]);X[0]=(Y[0]-this.nodeXY[0]);X[1]=(Y[1]-this.nodeXY[1]);this.region={"0":Y[0],"1":Y[1],area:0,top:Y[1],right:Y[0]+this.get(N).get(K),bottom:Y[1]+this.get(N).get(C),left:Y[0]};this.fire(O,{pageX:Y[0],pageY:Y[1],scroll:V,info:{start:Z,xy:Y,delta:W,offset:X}});this.lastXY=Y;},_defDragFn:function(V){if(this.get("move")){if(V.scroll){V.scroll.node.set("scrollTop",V.scroll.top);V.scroll.node.set("scrollLeft",V.scroll.left);}this.get(N).setXY([V.pageX,V.pageY]);this.realXY=[V.pageX,V.pageY];}},_move:function(X){if(this.get("lock")){return false;}else{this.mouseXY=[X.pageX,X.pageY];if(!this._dragThreshMet){var W=Math.abs(this.startXY[0]-X.pageX),V=Math.abs(this.startXY[1]-X.pageY);if(W>this.get("clickPixelThresh")||V>this.get("clickPixelThresh")){this._dragThreshMet=true;this.start();this._alignNode([X.pageX,X.pageY]);}}else{if(this._clickTimeout){this._clickTimeout.cancel();}this._alignNode([X.pageX,X.pageY]);}}},stopDrag:function(){if(this.get(G)){E._end();}return this;},destructor:function(){this._unprep();this.detachAll();if(this.target){this.target.destroy();}E._unregDrag(this);}});D.namespace("DD");D.DD.Drag=A;},"@VERSION@",{requires:["dd-ddm-base","event-synthetic","event-gestures"],skinnable:false});