import struct

def parse_prop(f):
    type_char = f.read(1).decode('latin1')
    if type_char in 'Y': return struct.unpack('<h', f.read(2))[0]
    elif type_char in 'C': return struct.unpack('<?', f.read(1))[0]
    elif type_char in 'I': return struct.unpack('<i', f.read(4))[0]
    elif type_char in 'F': return struct.unpack('<f', f.read(4))[0]
    elif type_char in 'D': return struct.unpack('<d', f.read(8))[0]
    elif type_char in 'L': return struct.unpack('<q', f.read(8))[0]
    elif type_char in 'f':
        arr_len, enc, comp_len = struct.unpack('<III', f.read(12))
        f.seek(comp_len if enc else arr_len * 4, 1)
        return f'<float[{arr_len}]>'
    elif type_char in 'd':
        arr_len, enc, comp_len = struct.unpack('<III', f.read(12))
        f.seek(comp_len if enc else arr_len * 8, 1)
        return f'<double[{arr_len}]>'
    elif type_char in 'l':
        arr_len, enc, comp_len = struct.unpack('<III', f.read(12))
        f.seek(comp_len if enc else arr_len * 8, 1)
        return f'<int64[{arr_len}]>'
    elif type_char in 'i':
        arr_len, enc, comp_len = struct.unpack('<III', f.read(12))
        f.seek(comp_len if enc else arr_len * 4, 1)
        return f'<int32[{arr_len}]>'
    elif type_char in 'b':
        arr_len, enc, comp_len = struct.unpack('<III', f.read(12))
        f.seek(comp_len if enc else arr_len * 1, 1)
        return f'<bool[{arr_len}]>'
    elif type_char in 'S':
        slen = struct.unpack('<I', f.read(4))[0]
        return f.read(slen).decode('latin1', errors='replace')
    elif type_char in 'R':
        slen = struct.unpack('<I', f.read(4))[0]
        return f.read(slen)
    else:
        raise ValueError(f'Unknown type: {type_char}')

with open('International Space Station (ISS) (E) [internal].fbx', 'rb') as f:
    f.seek(27)
    null_models = []
    mesh_models = []
    materials = []
    while True:
        data = f.read(13)
        if len(data) < 13: break
        end_offset, num_props, prop_len, name_len = struct.unpack('<IIIB', data)
        if end_offset == 0:
            if f.tell() >= 315560000: break
            continue
        name = f.read(name_len).decode('latin1', errors='ignore')
        if name == 'Objects':
            while f.tell() < end_offset:
                sub_data = f.read(13)
                if len(sub_data) < 13: break
                sub_end, sub_props, sub_plen, sub_nlen = struct.unpack('<IIIB', sub_data)
                if sub_end == 0: continue
                sub_name = f.read(sub_nlen).decode('latin1', errors='ignore')
                props = []
                for _ in range(sub_props):
                    props.append(parse_prop(f))
                if sub_name == 'Model':
                    m_type = props[2] if len(props) > 2 else ''
                    m_name = props[1].split('\x00')[0]
                    if m_type == 'Null':
                        null_models.append((props[0], m_name))
                    else:
                        mesh_models.append((props[0], m_name))
                elif sub_name == 'Material':
                    materials.append((props[0], props[1].split('\x00')[0]))
                f.seek(sub_end)
            break
        else:
            f.seek(end_offset)

    print(f'Null models (Hierarchy / Groups): {len(null_models)}')
    for id, name in null_models:
        print(f'  Group: {name}')
    print(f'\nTotal Mesh models: {len(mesh_models)}')
    print('Sample Meshes:')
    for id, name in mesh_models[:20]:
        print(f'  Mesh: {name}')
