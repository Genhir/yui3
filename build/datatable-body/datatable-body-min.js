YUI.add("datatable-body",function(a){var e=a.Lang,f=e.isArray,j=e.sub,i=a.Escape.html,c=a.Array,g=a.bind,h=a.Object,b=a.ClassNameManager,d=b.getClassName;a.namespace("DataTable").BodyView=a.Base.create("tableBody",a.View,[],{CELL_TEMPLATE:'<td role="gridcell" headers="{headers}" class="{className}">{content}</td>',ROW_TEMPLATE:'<tr role="row" id="{rowId}" class="{rowClasses}">'+"{content}"+"</tr>",getCell:function(n,l){var k=this.get("container"),m;if(k){m=k.getDOMNode().rows[+n];m&&(m=m.cells[+l]);}return a.one(m);},getClassName:function(){var k=c(arguments);k.unshift(this._cssPrefix);k.push(true);return d.apply(b,k);},getRow:function(l){var k=this.get("container");return a.one(k&&k.getDOMNode().rows[+l]);},render:function(){var k=this.get("container"),m=this.get("modelList"),l=this.columns;this._createRowTemplate(l);if(k&&m){k.setContent(this._createDataHTML(l));this._applyNodeFormatters(k,l);}this.bindUI();return this;},_afterColumnsChange:function(k){this.columns=this._parseColumns(k.newVal);this.render();},_afterDataChange:function(k){this.render();},_applyNodeFormatters:function(q,l){var k=this.source,o=this.get("modelList"),n=[],s=q.getDOMNode(),m="."+this.getClassName("liner"),p,r;for(p=0,r=l.length;p<r;++p){if(l[p].nodeFormatter){n.push(p);}}if(o&&n.length){o.each(function(x,y){var v={data:x.toJSON(),record:x,rowindex:y},C=s.rows[y],w,z,u,B,A,t;if(C){for(w=0,z=n.length;w<z;++w){A=a.one(C.cells[n[w]]);if(A){u=v.column=l[n[w]];B=u.key||u._yuid;v.value=x.get(B);v.td=A;v.cell=A.one(m)||A;t=u.nodeFormatter.call(k,v);if(t===false){A.destroy(true);}}}}});}},bindUI:function(){var k=this._eventHandles,l=this.get("modelList");if(this.source&&!k.columnsChange){k.columnsChange=this.source.after("columnsChange",g("_afterColumnsChange",this));}if(!k.dataChange){k.dataChange=l.after(["*:change","add","remove","reset"],g("_afterDataChange",this));}},_cssPrefix:b.getClassName("table"),_createDataHTML:function(l){var m=this.get("modelList"),k="";if(m){m.each(function(o,n){k+=this._createRowHTML(o,n);},this);}return k;},_createRowHTML:function(r,s){var p=r.toJSON(),v={rowId:r.get("clientId"),rowClasses:(s%2)?this.CLASS_ODD:this.CLASS_EVEN},k=this.source||this,n=this.columns,q,t,l,m,u,o;for(q=0,t=n.length;q<t;++q){l=n[q];u=p[l.key];m=l._id;v[m+"-className"]="";if(l.formatter){o={value:u,data:p,column:l,record:r,className:"",rowindex:s};if(typeof l.formatter==="string"){u=j(l.formatter,o);}else{u=l.formatter.call(k,o);if(u===undefined){u=o.value;}v[m+"-className"]=o.className;}}if(u===undefined||u===""){u=l.emptyCellValue||"";}v[m]=l.allowHTML?u:i(u);}return j(this._rowTemplate,v);},_createRowTemplate:function(m){var p="",s=this.CELL_TEMPLATE,o,q,l,r,n,k;for(o=0,q=m.length;o<q;++o){l=m[o];r=l.key;n=l._id;k={content:"{"+n+"}",headers:l.headers.join(" "),className:this.getClassName("col",n)+" "+this.getClassName("cell")+" {"+n+"-className}"};if(l.nodeFormatter){k.content="";}p+=j(s,k);}this._rowTemplate=j(this.ROW_TEMPLATE,{content:p});},destructor:function(){(new a.EventHandle(h.values(this._eventHandles))).detach();},initializer:function(k){var l=k.cssPrefix||(k.source||{}).cssPrefix;this.source=k.source;this.columns=this._parseColumns(k.columns);this._eventHandles={};if(l){this._cssPrefix=l;}this.CLASS_ODD=this.getClassName("odd");this.CLASS_EVEN=this.getClassName("even");},_parseColumns:function(o,n){var l,m,k;n||(n=[]);if(f(o)&&o.length){for(m=0,k=o.length;m<k;++m){l=o[m];if(typeof l==="string"){l={key:l};}if(l.key||l.formatter||l.nodeFormatter){l.index=n.length;n.push(l);}else{if(l.children){this._parseColumns(l.children,n);}}}}return n;}});},"@VERSION@",{requires:["datatable-core","view","classnamemanager"]});