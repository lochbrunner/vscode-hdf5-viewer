{
    "targets": [
        {
            'include_dirs': [
                'highfive/include',
                'json/include',
                '/usr/include/hdf5/serial'
            ],
            'libraries': [
                '/usr/lib/x86_64-linux-gnu/libhdf5_serial.so.103.0.0'
            ],
            'cflags!': ['-fno-exceptions'],
            'cflags_cc!': ['-fno-exceptions'],
            "target_name": "highfive",
            "sources": ["highfive_node/module.cc", "highfive_node/highfive_handler.cc"]
        }
    ]
}
