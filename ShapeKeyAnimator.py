bl_info = {
    "name": "Shape Key Animator",
    "blender": (3, 0, 0),
    "category": "Object",
    "description": "Create and animate shape keys for each frame. You can find this addon in the object section of the active object",
}

import bpy

class ShapeKeyAnimatorProperties(bpy.types.PropertyGroup):
    start_frame: bpy.props.IntProperty(
        name="Start Frame",
        description="Start frame for animation",
        default=1,
        min=1
    )
    
    end_frame: bpy.props.IntProperty(
        name="End Frame",
        description="End frame for animation",
        default=10,
        min=1
    )
    
    modifier_name: bpy.props.StringProperty(
        name="Modifier Name",
        description="Name of the modifier to apply as shape keys",
        default=""
    )

class OBJECT_OT_shape_key_animator(bpy.types.Operator):
    """Create and animate shape keys for each frame"""
    bl_idname = "object.shape_key_animator"
    bl_label = "Shape Key Animator"
    bl_options = {'REGISTER', 'UNDO'}
    
    def execute(self, context):
        obj = context.active_object
        settings = context.scene.shape_key_animator_settings
        
        if not obj:
            self.report({'ERROR'}, "No active object selected")
            return {'CANCELLED'}
        
        if not settings.modifier_name:
            self.report({'ERROR'}, "No modifier name specified")
            return {'CANCELLED'}
        
        # Ensure the object has an active shape key to start with
        if not obj.data.shape_keys:
            obj.shape_key_add(name="Basis")
        
        # Loop through the range of frames to create shape keys
        for frame in range(settings.start_frame, settings.end_frame + 1):
            context.scene.frame_set(frame)
            
            try:
                bpy.ops.object.modifier_apply_as_shapekey(keep_modifier=True, modifier=settings.modifier_name)
            except RuntimeError:
                self.report({'ERROR'}, f"Modifier '{settings.modifier_name}' not found on frame {frame}")
                return {'CANCELLED'}
            
            shape_key = obj.data.shape_keys.key_blocks[-1]
            shape_key.name = f"Frame_{frame}"
        
        # Create the animation keyframes
        for frame in range(settings.start_frame, settings.end_frame + 1):
            context.scene.frame_set(frame)
            
            for sk in obj.data.shape_keys.key_blocks:
                sk.value = 0
            
            shape_key = obj.data.shape_keys.key_blocks[f"Frame_{frame}"]
            shape_key.value = 1
            
            for sk in obj.data.shape_keys.key_blocks:
                sk.keyframe_insert(data_path="value", frame=frame)
        
        self.report({'INFO'}, "Shape keys created and animated for each frame")
        return {'FINISHED'}

class OBJECT_PT_shape_key_animator_panel(bpy.types.Panel):
    """Creates a Panel in the Object properties window"""
    bl_label = "Shape Key Animator"
    bl_idname = "OBJECT_PT_shape_key_animator"
    bl_space_type = 'PROPERTIES'
    bl_region_type = 'WINDOW'
    bl_context = "object"
    
    def draw(self, context):
        layout = self.layout
        settings = context.scene.shape_key_animator_settings
        
        col = layout.column(align=True)
        col.prop(settings, "start_frame")
        col.prop(settings, "end_frame")
        col.prop(settings, "modifier_name")
        
        row = layout.row()
        row.operator("object.shape_key_animator")

def register():
    bpy.utils.register_class(ShapeKeyAnimatorProperties)
    bpy.utils.register_class(OBJECT_OT_shape_key_animator)
    bpy.utils.register_class(OBJECT_PT_shape_key_animator_panel)
    bpy.types.Scene.shape_key_animator_settings = bpy.props.PointerProperty(type=ShapeKeyAnimatorProperties)

def unregister():
    bpy.utils.unregister_class(ShapeKeyAnimatorProperties)
    bpy.utils.unregister_class(OBJECT_OT_shape_key_animator)
    bpy.utils.unregister_class(OBJECT_PT_shape_key_animator_panel)
    del bpy.types.Scene.shape_key_animator_settings

if __name__ == "__main__":
    register()
