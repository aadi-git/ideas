/**
 * Class Interface for Canvas object
 */
class ViewObject {
  constructor() {
    this.objectid = "";
    this.type = "";
    this.color = "";
    this.opacity = 1;
    this.corners = {}; //If polygon
    this.isActive = false;
    this.set = setProperty;
    this.get = getProperty;
    this.onMouseDown = () => {};
    this.onMouseMove = () => {};
    this.onMouseUp = () => {};
    this.onMouseOut = () => {};
    this.onEdited = () => {};
  }
}

/**
 * Class for Canvas Polygon object
 */
export class Polygon extends ViewObject {
  constructor(config) {
    super();
    this.type = OBJECT_TYPES.POLYGON;
    this.objectid =
      "polygon" + new Date().getTime() + parseInt(Math.random() * 1000);
    this.color = config.color || "";
    this.opacity = config.opacity || 1;
    this.corners = config.corners || getDefaultPolygonCorners();
    this.onMouseDown = config.onMouseDown || this.onMouseDown;
    this.onMouseMove = config.onMouseMove || this.onMouseMove;
    this.onMouseUp = config.onMouseUp || this.onMouseUp;
    this.onMouseOut = config.onMouseOut || this.onMouseOut;
    this.onEdited = config.onEdited || this.onEdited;
  }
}

/**
 * Interface for Canvas object
 */
class CanvasInterface {
  activeObjectAction = OBJECT_ACTIONS.NONE;
  set = setProperty;
  get = getProperty;
  ctx = "";
}

/**
 * Object types to be inserted in Canvas
 */
const OBJECT_TYPES = {
  POLYGON: "POLYGON",
  POINT: "POINT"
};

/**
 * Actions on objectss
 */
const OBJECT_ACTIONS = {
  MOVING: "MOVING",
  RESIZING: "RESIZING",
  NONE: "NONE"
};

/**
 * Cursors to show on hovering on objects
 */
const CURSORS = {
  tl: "nwse-resize",
  tr: "nesw-resize",
  br: "nwse-resize",
  bl: "nesw-resize",
  moving: "move"
};

/**
 * All the cache variables used while performing an action (Moving, Resizing, hovering)
 */
const ACTION_VARIABLES = {
  activeObjectAction: "",
  eventCache: "",
  cursorOnObject: "",
  neighbourPoints: "",
  cornerKey: ""
};

/**
 * Object with type of object and its drawing methods
 */
const DRAW_FUNCTIONS = {
  [OBJECT_TYPES.POLYGON]: drawPolygon,
  [OBJECT_TYPES.POINT]: drawCircle
};

/**
 * @param {string} key
 * @param {any} value
 * Setter function
 */
function setProperty(key, value) {
  this[key] = value;
}

/**
 * @param {string} key
 * Getter function
 */
function getProperty(key) {
  return this[key];
}

/**
 * events |**************************|
 */

function canvasMouseDown() {
  ACTION_VARIABLES.activeObjectAction = OBJECT_ACTIONS.NONE;
  ACTION_VARIABLES.eventCache = null;
  if (this.activeObject && ACTION_VARIABLES.cursorOnObject) {
    ACTION_VARIABLES.activeObjectAction = OBJECT_ACTIONS.MOVING;
  }
  if (this.activeObject && ACTION_VARIABLES.neighbourPoints) {
    ACTION_VARIABLES.activeObjectAction = OBJECT_ACTIONS.RESIZING;
  }
}

function canvasMouseMove(event) {
  setCursorOnMouseMove.call(this, event);
  this.activeObject &&
    ACTION_VARIABLES.activeObjectAction !== OBJECT_ACTIONS.NONE &&
    dragOrResizeOnMouseMove.call(this, event, this.activeObject);
}

function canvasMouseUp(event) {
  this.activeObject && this.activeObject.onMouseUp(event);
  this.activeObject &&
    ACTION_VARIABLES.activeObjectAction !== OBJECT_ACTIONS.NONE &&
    this.activeObject.onEdited(this.activeObject);
  ACTION_VARIABLES.eventCache = null;
  ACTION_VARIABLES.activeObjectAction = OBJECT_ACTIONS.NONE;
}

function canvasMouseOut(event) {
  ACTION_VARIABLES.eventCache = null;
  this.activeObject &&
    ACTION_VARIABLES.activeObjectAction !== OBJECT_ACTIONS.NONE &&
    this.activeObject.onEdited(this.activeObject);
  ACTION_VARIABLES.activeObjectAction = OBJECT_ACTIONS.NONE;
}
// |**************************|

// Utility functions
/**
 * @param {object} ctx Canvas context
 * @param {object} object Canvas Object
 * @param {object} point
 * A function to check whether a point is in path or not
 */
export function isPointOnObject(ctx, object, point) {
  drawFromPath(
    ctx,
    Object.keys(object.corners).map(cornerKey => object.corners[cornerKey])
  );
  return ctx.isPointInPath(point.x, point.y);
}

/**
 * @param {object} pointOne {x,y}
 * @param {object} pointTwo {x,y}
 * @param {Number} radius
 * function to check if two points are inside the distance of radius
 */
function areNeighbourPoints(pointOne, pointTwo, radius) {
  return (
    Math.pow(pointTwo.x - pointOne.x, 2) +
      Math.pow(pointTwo.y - pointOne.y, 2) <
    Math.pow(radius, 2)
  );
}

// Default corners if none are given when creating the object
function getDefaultPolygonCorners() {
  return {
    tl: { x: 100, y: 100 },
    tr: { x: 300, y: 100 },
    br: { x: 300, y: 300 },
    bl: { x: 100, y: 300 }
  };
}

// Function to draw on ctx
export function drawFromPath(ctx, path) {
  ctx.beginPath();
  path.forEach((corner, index) => {
    index === 0 && ctx.moveTo(corner.x, corner.y);
    index !== 0 && ctx.lineTo(corner.x, corner.y);
    index === path.length - 1 && ctx.closePath();
  });
}

/**
 * Function to paint the object
 * @param {*} ctx
 * @param {*} object
 */
function decorate(ctx, object) {
  ctx.strokeStyle = object.color || "#000000";
  ctx.fillStyle = object.color || "rgba(0,0,0)";
  ctx.globalAlpha = object.opacity || 1;
  ctx.stroke();
  ctx.fill();
  ctx.globalAlpha = 1;
}

/**
 * Function to draw the polygon on ctx
 * @param {*} object
 */
function drawPolygon(object) {
  let corners = object.corners;
  var ctx = this.ctx;
  let path = [corners.tl, corners.tr, corners.br, corners.bl];
  drawFromPath(ctx, path);
  decorate(ctx, object);
  object.isActive && this.hignlightCorners(object);
}

/**
 * Function to draw a circle on canvas
 * Here we use it to draw corners to polygon
 * @param {*} object
 */
function drawCircle(object) {
  let position = object.position;
  var ctx = this.ctx;
  ctx.beginPath();
  ctx.arc(position.x, position.y, 3, 0, 2 * Math.PI);
  decorate(ctx, object);
}

/**
 * Function to bind events to the canvas
 */
function bindEvents() {
  // Attaching events to canvas
  this.canvasElement.addEventListener("mousedown", canvasMouseDown.bind(this));
  this.canvasElement.addEventListener("mousemove", canvasMouseMove.bind(this));
  this.canvasElement.addEventListener("mouseup", canvasMouseUp.bind(this));
  this.canvasElement.addEventListener("mouseout", canvasMouseOut.bind(this));
}

/**
 * Function to draw background image
 * @param {string} background
 */
function loadImage(background) {
  this.ctx.drawImage(background, 0, 0, this.width, this.height);
  this.set("backgroundImg", background);
}

/**
 * Function to setting curson type on mouse move
 * Also checking if cursor is on corners of polygon or inside the polygon
 * @param {EventObject} event
 */
function setCursorOnMouseMove(event) {
  let cursor = "";
  if (this.activeObject) {
    let { corners } = this.activeObject;
    let isCornerKey = false;
    let cursorForAction = CURSORS.moving;
    ACTION_VARIABLES.neighbourPoints = false;

    let cursorPoint = { x: event.offsetX, y: event.offsetY };
    Object.keys(corners).forEach(corner => {
      let pointTwo = { x: corners[corner].x, y: corners[corner].y };

      // Checking if cursor is on corners of polygon
      if (areNeighbourPoints(cursorPoint, pointTwo, 10)) {
        ACTION_VARIABLES.neighbourPoints = true;
        isCornerKey = true;
        cursorForAction = CURSORS[corner];
        ACTION_VARIABLES.cornerKey = corner;
      }
    });
    // Checking if cursor is on any point of polygon
    let setCursor =
      isPointOnObject(this.ctx, this.activeObject, cursorPoint) || isCornerKey;
    ACTION_VARIABLES.cursorOnObject = setCursor;
    cursor = setCursor ? cursorForAction : "";
  }
  this.canvasElement.style.cursor = cursor;
}

/**
 * Function to resize the polygon or move the polygon
 * @param {EventObject} event
 * @param {*} object
 */
function dragOrResizeOnMouseMove(event, object) {
  let { corners } = object;

  // Resizing by a corner
  if (ACTION_VARIABLES.activeObjectAction === OBJECT_ACTIONS.RESIZING) {
    corners[ACTION_VARIABLES.cornerKey].x = event.offsetX;
    corners[ACTION_VARIABLES.cornerKey].y = event.offsetY;
  }

  // dragging whole polygon
  else if (
    ACTION_VARIABLES.eventCache &&
    ACTION_VARIABLES.activeObjectAction === OBJECT_ACTIONS.MOVING
  ) {
    Object.keys(corners).forEach(corner => {
      corners[corner].x += event.offsetX - ACTION_VARIABLES.eventCache.offsetX;
      corners[corner].y += event.offsetY - ACTION_VARIABLES.eventCache.offsetY;
    });
  }
  ACTION_VARIABLES.eventCache = {
    offsetX: event.offsetX,
    offsetY: event.offsetY
  };
  object.corners = corners;
  this.editShape(object);
}

/**
 * Function for initializing parameters by canvas I
 * @param {string} canvasID
 */
function setCanvasByID(canvasID) {
  let canvasElement = document.getElementById(canvasID) || {};
  this.width = canvasElement.width || "";
  this.height = canvasElement.height || "";
  this.canvasElement = canvasElement || null;
  this.ctx = (canvasElement && canvasElement.getContext("2d")) || null;

  bindEvents.call(this);
}

/**
 * Class for Canvas object
 */
export class Canvas extends CanvasInterface {
  constructor(config) {
    super();
    this.activeObject = null;
    this.objects = [];
    this.backgroundImg = "";
    this.setCanvasByID = setCanvasByID.bind(this);
    this.setCanvasByID(config.canvasID);

    config.background && this.setBackground(config.background);
  }

  /**
   * Method to set canvas background
   */
  setBackground = url => {
    let background = new Image(this.width, this.height);
    background.src = url;
    background.addEventListener("load", e => {
      loadImage.call(this, background);
    });
  };

  /**
   * Method to return all objects from canvas
   */
  getObjects = () => {
    return this.objects;
  };

  /**
   * Method to return object by ID from canvas
   */
  getObjectByID = objectid => {
    let object = this.objects.filter(object => object.objectid === objectid)[0];
    return object ? object : null;
  };

  /**
   * Method to add object in canvas
   */
  add = shape => {
    if (shape) {
      shape.canvas = this;
      this.objects.push(shape);
      this.drawFromCanvasObjects();
    }
  };

  /**
   * Method for setting active object in canvas
   */
  setActiveObject = objectid => {
    let activeObject = this.objects.filter(object => {
      object.isActive = false;
      return object.objectid === objectid;
    })[0];
    if (activeObject) {
      this.activeObject = activeObject;
      this.activeObject.isActive = true;
    } else {
      this.activeObject = null;
    }
    this.drawFromCanvasObjects();
  };

  /**
   * Method for unsetting the active object in canvas
   */
  unsetActiveObject = objectToSelect => {
    this.objects.forEach(object => {
      if (object.objectid === objectToSelect.objectid) {
        object.isActive = false;
      }
    });
    if (
      this.activeObject &&
      objectToSelect.objectid === this.activeObject.objectid
    ) {
      this.activeObject = null;
    }
    this.drawFromCanvasObjects();
  };

  /**
   * Method to clear all objects in canvas
   */
  clear = () => {
    this.ctx.clearRect(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );
    this.backgroundImg && loadImage.call(this, this.backgroundImg);
    this.objects = [];
    this.activeObject = null;
    this.activeObjectAction = OBJECT_ACTIONS.NONE;
  };

  /**
   * Method to edit an object in canvas
   */
  editShape = shape => {
    let objectids = this.objects.map(shape => shape.objectid);
    objectids.indexOf(shape.objectid) !== -1 &&
      this.objects.splice(objectids.indexOf(shape.objectid), 1, shape);
    this.drawFromCanvasObjects();
  };

  /**
   * Method for removing an object from canvas
   */
  remove = objectid => {
    let objectids = this.objects.map(shape => shape.objectid);
    if (objectids.indexOf(objectid) !== -1) {
      this.objects.splice(objectids.indexOf(objectid), 1);
      this.drawFromCanvasObjects();
    }
  };

  /**
   * Method for highlighting an active object in canvas
   */
  hignlightCorners = object => {
    Object.keys(object.corners).forEach(corner => {
      drawCircle.call(this, {
        position: object.corners[corner],
        color: object.color
      });
    });
  };

  /**
   * Method to draw from objects in canvas
   */
  drawFromCanvasObjects = () => {
    this.ctx.clearRect(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );
    this.backgroundImg && loadImage.call(this, this.backgroundImg);
    this.objects.forEach(object => {
      DRAW_FUNCTIONS[object.type].call(this, object);
    });
  };
}
