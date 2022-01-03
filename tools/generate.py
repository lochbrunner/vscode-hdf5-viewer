#!/usr/bin/env python3


import h5py
from pathlib import Path


def main():
    filename = Path('test_data/sample.hdf5')
    with h5py.File(filename, 'w') as f:
        grp = f.create_group("group")
        grp.create_dataset("dataset_1", (100,), dtype='i')
        subgrp = grp.create_group("subgroup")
        subgrp.create_dataset("dataset_2", (100,), dtype='i')
        subgrp.create_dataset("dataset_3", (100,), dtype='i')


if __name__ == '__main__':
    main()
