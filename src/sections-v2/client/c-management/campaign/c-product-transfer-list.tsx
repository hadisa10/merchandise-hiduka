import React, { useState } from 'react';
import _ from 'lodash'; // Import lodash

import List from '@mui/material/List';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';

import Iconify from 'src/components/iconify';
import { IProductItem } from 'src/types/product';

// ----------------------------------------------------------------------

function not(a: IProductItem[], b: IProductItem[]) {
  return a.filter((value) => !b.includes(value));
}

function intersection(a: IProductItem[], b: IProductItem[]) {
  return a.filter((value) => b.includes(value));
}

function union(a: IProductItem[], b: IProductItem[]) {
  return [...a, ...not(b, a)];
}

export default function CProductTransferList({ products, clientProducts }: { products: IProductItem[], clientProducts: IProductItem[] }) {
  const [checked, setChecked] = useState<IProductItem[]>([]);

  const filteredClientProducts = _.filter(clientProducts, (clientProd) =>
    !_.some(products, (prod) => prod._id.toString() === clientProd._id.toString()));


  // Assuming `products` and `clientProducts` are already filtered lists of available vs selected
  const [left, setLeft] = useState<IProductItem[]>(filteredClientProducts);
  const [right, setRight] = useState<IProductItem[]>(products);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (product: IProductItem) => () => {
    const currentIndex = checked.indexOf(product);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(product);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: IProductItem[]) => intersection(checked, items).length;

  const handleToggleAll = (items: IProductItem[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title: React.ReactNode, items: IProductItem[]) => (
    <Card sx={{ borderRadius: 1.5 }}>
      <CardHeader
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
            disabled={items.length === 0}
            inputProps={{ 'aria-label': 'all items selected' }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
        sx={{ p: 2 }}
      />

      <Divider />

      <List
        dense
        component="div"
        role="list"
        sx={{
          width: 200,
          height: 220,
          overflow: 'auto',
        }}
      >
        {items.map((product: IProductItem) => {
          const labelId = `transfer-list-item-${product._id}-label`;
          return (
            <ListItemButton key={product._id} role="listitem" onClick={handleToggle(product)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.includes(product)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={product.name} />
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ width: 'auto', p: 3 }}>
      <Grid>{customList('Un-Selected', left)}</Grid>

      <Grid container direction="column" alignItems="center" sx={{ p: 3 }}>
        <Button
          color="inherit"
          variant="outlined"
          size="small"
          onClick={handleCheckedRight}
          disabled={leftChecked.length === 0}
          aria-label="move selected right"
          sx={{ my: 1 }}
        >
          <Iconify icon="eva:arrow-ios-forward-fill" width={18} />
        </Button>

        <Button
          color="inherit"
          variant="outlined"
          size="small"
          onClick={handleCheckedLeft}
          disabled={rightChecked.length === 0}
          aria-label="move selected left"
          sx={{ my: 1 }}
        >
          <Iconify icon="eva:arrow-ios-back-fill" width={18} />
        </Button>
      </Grid>

      <Grid>{customList('Selected', right)}</Grid>
    </Grid>
  );
}
