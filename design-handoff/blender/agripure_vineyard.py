# AgriPure hero — Blender scene + animation scaffold
# ----------------------------------------------------
# Builds the deterministic parts of the photoreal vineyard hero so the render
# matches the website's scroll timeline 1:1:
#   • a camera move keyframed from the EXACT formulas in EXPERIENCE_3D.md §A
#   • a "Control" empty with health / flowers / fruit / app / clear custom
#     properties keyframed per step — drive shape keys, materials and particle
#     systems off these so the beats line up with the on-page step panel
#   • render settings (Cycles, AgX, 30fps, 240 frames, 16:9) + step markers
#
# What you (or a 3D artist) still attach for photoreal output — marked TODO:
#   • World HDRI (Poly Haven, CC0) + sun strength
#   • PBR soil/ground material + geometry-nodes vine-row scatter
#   • a real grapevine GLTF with shape keys for growth + grape clusters
#   • particle systems for drip / mist, threat sprites/objects
#
# Run:  blender -b -P design-handoff/blender/agripure_vineyard.py
#       (or open Blender → Scripting → run; then Render → Render Animation)

import bpy, math

FPS = 30
FRAMES = 240          # ~8s of scroll
INTRO_END = 0.085     # matches hero-timeline.ts
STEP_COUNT = 7
RES_X, RES_Y = 1600, 1000   # web hero crop; render larger then downscale if you prefer

def clamp(x, a, b): return max(a, min(b, x))
def smoothstep(e0, e1, x):
    t = clamp((x - e0) / (e1 - e0), 0.0, 1.0)
    return t * t * (3 - 2 * t)
def lerp(a, b, t): return a + (b - a) * t

# Three.js is Y-up; Blender is Z-up. Map (x,y,z)_three -> (x,-z,y)_blender.
def to_blender(x, y, z): return (x, -z, y)

# --- camera state for scroll progress p (ported from scene.ts / EXPERIENCE_3D §A) ---
def camera_at(p):
    if p < INTRO_END:
        t = smoothstep(0, 1, p / INTRO_END)
        pos = (lerp(-6, math.sin(-0.55) * 5.4, t), lerp(15, 2.1, t), lerp(22, 5.4, t))
        look = (lerp(2, 0, t), 1.5, lerp(-10, 0, t))
        return pos, look, -1, 0.0
    seg = (p - INTRO_END) / (1 - INTRO_END)
    f = clamp(seg * STEP_COUNT, 0, STEP_COUNT - 0.0001)
    idx = int(f); lt = f - idx
    a = -0.55 + seg * 1.15
    r = 5.4 - seg * 1.7 - smoothstep(0.2, 0.7, lt) * 0.5
    hy = 1.95 + math.sin(seg * 2 * math.pi) * 0.25
    pos = (math.sin(a) * r, hy, math.cos(a) * r)
    look = (0, 1.45, 0)
    return pos, look, idx, lt

# --- per-step rig values (drive your shape keys / materials off these) ---
def rig_at(p):
    pos, look, idx, lt = camera_at(p)
    health = 0.12 if idx < 0 else (idx + smoothstep(0.32, 0.72, lt)) / STEP_COUNT
    app = 0.0 if idx < 0 else smoothstep(0.16, 0.30, lt) * (1 - smoothstep(0.64, 0.80, lt))
    clear = 0.0 if idx < 0 else smoothstep(0.32, 0.66, lt)
    flowers = smoothstep(0.2, 0.7, lt) if idx == 5 else (1.0 if idx > 5 else 0.0)
    fruit = smoothstep(0.25, 0.8, lt) if idx >= 6 else 0.0
    return idx, health, app, clear, flowers, fruit

def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)

def setup_render():
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    try: sc.cycles.device = 'GPU'
    except Exception: pass
    sc.cycles.samples = 256
    sc.render.resolution_x = RES_X
    sc.render.resolution_y = RES_Y
    sc.render.fps = FPS
    sc.frame_start = 1
    sc.frame_end = FRAMES
    # AgX (Blender 4.x) for filmic, photoreal highlights; fall back to Filmic.
    try: sc.view_settings.view_transform = 'AGX'
    except Exception:
        try: sc.view_settings.view_transform = 'Filmic'
        except Exception: pass
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_depth = '16'
    sc.render.filepath = "//render/frame_"

def make_world_and_sun():
    # SETTING: Central Coast California coastal ranch — golden rolling hills + Pacific.
    # TODO: load a coastal golden-hour HDRI (Poly Haven, e.g. a late-afternoon coast /
    # field sky) into the world Environment Texture for image-based lighting + reflections.
    world = bpy.data.worlds.new("AgriPureSky"); world.use_nodes = True
    bpy.context.scene.world = world
    bg = world.node_tree.nodes.get("Background")
    if bg: bg.inputs[0].default_value = (0.66, 0.78, 0.90, 1); bg.inputs[1].default_value = 1.0
    # Warm, low golden-hour sun raking across the hills toward the ocean.
    sun_data = bpy.data.lights.new("Sun", 'SUN'); sun_data.energy = 4.5; sun_data.angle = math.radians(1.6)
    sun_data.color = (1.0, 0.86, 0.66)
    sun = bpy.data.objects.new("Sun", sun_data); bpy.context.collection.objects.link(sun)
    sun.rotation_euler = (math.radians(62), 0, math.radians(-115))

def make_ground():
    bpy.ops.mesh.primitive_plane_add(size=400)
    g = bpy.context.active_object; g.name = "Ground"
    # TODO: assign a PBR soil material (albedo/normal/rough/AO) + tiled crop-row texture.
    mat = bpy.data.materials.new("Soil"); mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf: bsdf.inputs["Base Color"].default_value = (0.27, 0.19, 0.11, 1); bsdf.inputs["Roughness"].default_value = 1.0
    g.data.materials.append(mat)

def make_vine_rows():
    # Placeholder vine canopy rows. TODO: swap cubes for a grapevine GLTF and
    # scatter with geometry nodes; keep the central path clear for the hero.
    coll = bpy.data.collections.new("VineRows"); bpy.context.scene.collection.children.link(coll)
    row_spacing = 2.4
    rx = -34.0
    while rx <= 34.0:
        if abs(rx) >= 2.0:
            z = 8.0
            while z >= -64.0:
                if not (abs(rx) < 2.2 and z > -1.6):
                    bx, by, bz = to_blender(rx, 0.6, z)
                    bpy.ops.mesh.primitive_cube_add(size=1, location=(bx, by, bz))
                    o = bpy.context.active_object; o.scale = (0.6, 0.45, 1.0); o.name = "vine"
                    for c in list(o.users_collection): c.objects.unlink(o)
                    coll.objects.link(o)
                z -= 1.4
        rx += row_spacing

def make_hills():
    # Rolling golden Central-Coast hills behind/around the vineyard. Placeholders —
    # TODO: sculpt/scatter real terrain + dry-grass material; keep the ocean visible to -Z.
    mat = bpy.data.materials.new("Hills"); mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf: bsdf.inputs["Base Color"].default_value = (0.66, 0.58, 0.34, 1); bsdf.inputs["Roughness"].default_value = 1.0
    mounds = [(-24, -40, 16, 8), (18, -50, 20, 9), (-6, -62, 30, 13), (34, -44, 14, 7), (-38, -56, 18, 10), (8, -78, 40, 17)]
    for hx, hz, s, h in mounds:
        bx, by, bz = to_blender(hx, -3, hz)
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=1, location=(bx, by, bz))
        o = bpy.context.active_object; o.scale = (s, s, h * 0.45); o.name = "hill"
        o.data.materials.append(mat)

def make_ocean():
    # The Pacific on the horizon to the -Z (behind the hero, where the camera looks).
    # TODO: add subtle wave normal/displacement + a touch of foam near the shoreline.
    ox, oy, oz = to_blender(0, -1.2, -150)
    bpy.ops.mesh.primitive_plane_add(size=600, location=(ox, oy, oz))
    o = bpy.context.active_object; o.name = "Ocean"
    mat = bpy.data.materials.new("Ocean"); mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = (0.04, 0.13, 0.20, 1)
        bsdf.inputs["Roughness"].default_value = 0.08
        try: bsdf.inputs["Specular IOR Level"].default_value = 0.6  # Blender 4.x
        except Exception: pass
    o.data.materials.append(mat)

def make_hero_and_control():
    # Hero plant placeholder at origin. TODO: replace with a grapevine GLTF whose
    # growth/fruit are driven by the Control empty's custom properties below.
    hx, hy, hz = to_blender(0, 1.0, 0)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.1, depth=2.0, location=(hx, hy, hz))
    bpy.context.active_object.name = "HeroVine"

    ctrl = bpy.data.objects.new("Control", None); bpy.context.collection.objects.link(ctrl)
    ctrl.empty_display_size = 0.4
    for k in ("health", "app", "clear", "flowers", "fruit"):
        ctrl[k] = 0.0
    return ctrl

def make_camera():
    cam_data = bpy.data.cameras.new("HeroCam"); cam_data.lens = 32  # ~46° vfov-ish
    cam_data.dof.use_dof = True; cam_data.dof.aperture_fstop = 2.8  # cinematic focus
    cam = bpy.data.objects.new("HeroCam", cam_data); bpy.context.collection.objects.link(cam)
    bpy.context.scene.camera = cam
    target = bpy.data.objects.new("CamTarget", None); bpy.context.collection.objects.link(target)
    target.empty_display_size = 0.2
    tc = cam.constraints.new('TRACK_TO'); tc.target = target
    tc.track_axis = 'TRACK_NEGATIVE_Z'; tc.up_axis = 'UP_Y'
    cam_data.dof.focus_object = target
    return cam, target

def keyframe_animation(cam, target, ctrl):
    for frame in range(1, FRAMES + 1):
        p = (frame - 1) / (FRAMES - 1)
        pos, look, _idx, _lt = camera_at(p)
        idx, health, app, clear, flowers, fruit = rig_at(p)
        cam.location = to_blender(*pos)
        target.location = to_blender(*look)
        cam.keyframe_insert("location", frame=frame)
        target.keyframe_insert("location", frame=frame)
        ctrl["health"], ctrl["app"], ctrl["clear"], ctrl["flowers"], ctrl["fruit"] = health, app, clear, flowers, fruit
        for k in ("health", "app", "clear", "flowers", "fruit"):
            ctrl.keyframe_insert(f'["{k}"]', frame=frame)

def add_step_markers():
    sc = bpy.context.scene
    names = ["Restore", "Cleanse", "Strength", "Protect", "Prevent", "Grow", "Boost"]
    for i, name in enumerate(names):
        p = INTRO_END + (i + 0.5) / STEP_COUNT * (1 - INTRO_END)
        f = max(1, round(p * (FRAMES - 1)) + 1)
        mk = sc.timeline_markers.new(f"{i+1:02d} {name}", frame=f)
        _ = mk

def main():
    reset_scene()
    setup_render()
    make_world_and_sun()
    make_ground()
    make_ocean()
    make_hills()
    make_vine_rows()
    ctrl = make_hero_and_control()
    cam, target = make_camera()
    keyframe_animation(cam, target, ctrl)
    add_step_markers()
    print("AgriPure hero scaffold built. Attach HDRI/PBR/GLTF/particles, then Render Animation.")

if __name__ == "__main__":
    main()
