//From https://github.com/EvanHahn/ScriptInclude
include=function(){function f(){var a=this.readyState;(!a||/ded|te/.test(a))&&(c--,!c&&e&&d())}var a=arguments,b=document,c=a.length,d=a[c-1],e=d.call;e&&c--;for(var g,h=0;c>h;h++)g=b.createElement("script"),g.src=arguments[h],g.async=!0,g.onload=g.onerror=g.onreadystatechange=f,(b.head||b.getElementsByTagName("head")[0]).appendChild(g)};
serialInclude=function(a){var b=console,c=serialInclude.l;if(a.length>0)c.splice(0,0,a);else b.log("Done!");if(c.length>0){if(c[0].length>1){var d=c[0].splice(0,1);b.log("Loading "+d+"...");include(d,function(){serialInclude([]);});}else{var e=c[0][0];c.splice(0,1);e.call();};}else b.log("Finished.");};serialInclude.l=new Array();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) {
      vars[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return vars;
}	 
//Include additional files here
serialInclude(['../lib/CGF.js', 
               'XMLscene.js', 
               'MySceneGraph.js', 
               'MyInterface.js', 
               'MyRectangle.js',
               'MyCylinder.js',
               'MySphere.js',
               'MyTorus.js',
               'MyTriangle.js',
               'MyGraphNode.js',
               'Animation.js',
               'KeyFrameAnimation.js',
               'MyKeyframe.js',
               'MySecurityCamera.js',
               'Plane.js',
               'Patch.js',
               'NurbCylinder.js',
               'MyGameTable.js',
               'MyNurbsCube.js',
               'MyRectangleXZ.js',
               'MyOBJModel.js',
               'CGFOBJModel.js',
               'CGFResourceReader.js',
               'game/Board.js',
               'game/Communicator.js',
               'game/Animator.js',
               'game/GameMove.js',
               'game/GameOrchestrator.js',
               'game/GameSequence.js',
               'game/PanelsManager.js',
               'game/primitives/Panel.js',
               'game/primitives/Tile.js',
               'game/primitives/Microbe.js',
               'game/primitives/SideBoard.js',
               'game/templates/BoardTemplate.js',
               'game/templates/MicrobeTemplate.js',
               'game/templates/NumbersTemplate.js',
               'game/templates/GamePanelTemplate.js',
               'game/templates/MenuPanelTemplate.js',
               'game/templates/SideBoardTemplate.js',

main=function()
{
	// Standard application, scene and interface setup
    var app = new CGFapplication(document.body);
    var myInterface = new MyInterface();
    var myScene = new XMLscene(myInterface, 2);

    app.init();

    app.setScene(myScene);
    app.setInterface(myInterface);

    myInterface.setActiveCamera(myScene.camera);

	// get file name provided in URL, e.g. http://localhost/myproj/?file=myfile.xml 
	// or use "demo.xml" as default (assumes files in subfolder "scenes", check MySceneGraph constructor) 
	
    var filename1 = "poolside.xml";
    var filename2 = "arctic.xml"

	// create and load graph, and associate it to scene. 
	// Check console for loading errors
	var myGraph1 = new MySceneGraph(filename1, myScene, 0);
    var myGraph2 = new MySceneGraph(filename2, myScene, 1);
    
	// start
    app.run();
}

]);
