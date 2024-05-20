import React from 'react';
import JSZip from 'jszip';
import { omit } from 'lodash';
import { saveAs } from 'file-saver';

import { Badge, IconButton, IconButtonProps, CircularProgress } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';

type IURL = Array<{ src: string, name: string }>

const MultiDownloadButton = ({ urls, ...rest }: { urls: IURL } & IconButtonProps) => {

    const loading = useBoolean(false);
    const handleDownload = async (argUrls: IURL) => {
        loading.onTrue();
        if (argUrls.length === 1) {
            const apiUrl = `/api/file-download?url=${encodeURIComponent(argUrls[0].src)}`;
            // If only one URL, download directly
            await downloadImage(apiUrl, argUrls[0].name).finally(() => {
                loading.onFalse();
            });
        } else {
            // If multiple URLs, download as zip using Promise.all
            const zip = new JSZip();

            const promises = argUrls.map(url => {
                const apiUrl = `/api/file-download?url=${encodeURIComponent(url.src)}`;
                return fetch(apiUrl)
                    .then(response => {
                        if (!response.ok) throw new Error(`Failed to fetch ${apiUrl}`);
                        return response.blob();
                    })
                    .then(blob => {
                        zip.file(url.name, blob);
                    })
                    .catch(error => {
                        console.error(`Error fetching ${url.src}:`, error);
                        // Optionally handle errors for individual downloads, e.g., skip or use placeholders
                    });
            });

            await Promise.all(promises).then(() => {
                zip.generateAsync({ type: 'blob' }).then((content) => {
                    saveAs(content, 'images.zip');
                });
            }).catch(error => {
                console.error('Error in downloading some images:', error);
            }).finally(() => {
                loading.onFalse()
            })
        }
    };

    const downloadImage = async (url: string, filename: string) => fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.blob();
            })
            .then(blob => {
                saveAs(blob, filename);
            })
            .catch(error => {
                console.error('Error downloading the image:', error);
            });

    return (
        <Badge badgeContent={loading.value ? urls.length : 0}>
            <IconButton sx={{ width: "max-content", height: "max-content"}} {...omit(rest, "urls")} onClick={() => handleDownload(urls)} disabled={loading.value} >
                {
                    loading.value ?
                        <CircularProgress size={24} color="info" />
                        :
                        <Iconify icon="eva:arrow-circle-down-fill" width={24} />
                }
            </IconButton>
        </Badge>

    );
};

export default MultiDownloadButton;
