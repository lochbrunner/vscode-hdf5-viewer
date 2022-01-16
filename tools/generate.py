#!/usr/bin/env python3


import h5py
import numpy as np
from pathlib import Path


def main():
    filename = Path('test_data/sample.hdf5')
    with h5py.File(filename, 'w') as f:
        grp = f.create_group("group")
        grp.attrs['date'] = 'today'
        grp.attrs['purpose'] = 'demo'
        dat1 = grp.create_dataset("dataset_1", (100,), dtype='i')
        dat1.attrs['date'] = 'tomorrow'
        dat1.attrs['purpose'] = 'let see'
        subgrp = grp.create_group("subgroup")
        subgrp.create_dataset("dataset_2", (100,), dtype='i')
        subgrp.create_dataset("dataset_3", (100,), dtype='i')

        # complex dataset
        data1 = np.arange(50.)
        data2 = 2.0*data1
        data3 = 3.0*data1
        data4 = 3.0*data1

        # use namesList to define dtype for recarray
        namesList = ['height', 'mass', 'velocity', 'gravity']
        ds_dt = np.dtype({'names': namesList, 'formats': [(float)]*4})

        rec_arr = np.rec.fromarrays([data1, data2, data3, data4], dtype=ds_dt)
        dat3 = grp.create_dataset('physics', (50,), data=rec_arr)
        dat3.attrs['date'] = 'yesterday'
        dat3.attrs['purpose'] = 'complex'


if __name__ == '__main__':
    main()
