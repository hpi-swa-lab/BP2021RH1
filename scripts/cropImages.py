#
# Adapted from https://github.com/z80z80z80/autocrop/blob/master/autocrop.py
#

import cv2
import numpy as np
import os

def order_rect(points):
    res = np.zeros((4, 2), dtype=np.float32)

    s = np.sum(points, axis = 1)    
    d = np.diff(points, axis = 1)

    res[0] = points[np.argmin(s)]
    res[1] = points[np.argmin(d)]
    res[2] = points[np.argmax(s)]
    res[3] = points[np.argmax(d)]

    return res

def four_point_transform(img, points):
    rect = order_rect(points)
    (tl, tr, br, bl) = rect

    widthA = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
    widthB = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
    maxWidth = max(int(widthA), int(widthB))
    
    heightA = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
    heightB = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
    maxHeight = max(int(heightA), int(heightB))

    dst = np.array([[0, 0],
                    [maxWidth - 1, 0],
                    [maxWidth - 1, maxHeight - 1],
                    [0, maxHeight - 1]], dtype = np.float32)

    M = cv2.getPerspectiveTransform(rect, dst)
    warped = cv2.warpPerspective(img, M, (maxWidth, maxHeight))

    return warped

def cont(img, gray, user_thresh, crop):
    found = False
    loop = False
    old_val = 0
    i = 0

    im_h, im_w = img.shape[:2]
    while found == False:
        if user_thresh >= 255 or user_thresh == 0 or loop:         
            break

        ret, thresh = cv2.threshold(gray, user_thresh, 255, cv2.THRESH_BINARY)
        contours = cv2.findContours(thresh, cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)[0]        
        im_area = im_w * im_h
        
        for cnt in contours:
            area = cv2.contourArea(cnt)
            if area > (im_area/100) and area < (im_area/1.01):
                epsilon = 0.1 * cv2.arcLength(cnt,True)
                approx = cv2.approxPolyDP(cnt,epsilon,True)

                if len(approx) == 4:
                    found = True
                elif len(approx) > 4:
                    user_thresh = user_thresh - 1
                    print(f"Adjust Threshold: {user_thresh}")
                    if user_thresh == old_val + 1:
                        loop = True
                    break
                elif len(approx) < 4:
                    user_thresh = user_thresh + 5
                    print(f"Adjust Threshold: {user_thresh}")
                    if user_thresh == old_val - 5:
                        loop = True
                    break

                rect = np.zeros((4, 2), dtype = np.float32)
                rect[0] = approx[0]
                rect[1] = approx[1]
                rect[2] = approx[2]
                rect[3] = approx[3]
                
                dst = four_point_transform(img, rect)
                dst_h, dst_w = dst.shape[:2]
                img = dst[crop:dst_h-crop, crop:dst_w-crop]
            else:
                if i > 100:
                    user_thresh = user_thresh + 5
                    if user_thresh > 255:
                        break
                    print(f"Adjust Threshold: {user_thresh}")
                    print("WARNING: This seems to be an edge case. If the result isn't satisfying try lowering the threshold using -t")
                    if user_thresh == old_val - 5:
                        loop = True                
        i += 1
        if i%2 == 0:
            old_value = user_thresh

    return found, img

def get_name(filename):
    f_reversed = filename[::-1]
    index = -1 * f_reversed.find('/') - 1

    return filename[index:]

def autocrop(params):
    thresh = params['thresh']
    crop = params['crop']
    filename = params['filename']
    out_path = params['out_path']
    black_bg = params['black']

    print(f"Opening: {filename}")
    name = get_name(filename) # only the part after the folder
    img = cv2.imread(filename)
    if black_bg: # invert the image if the background is black
        img = invert(img)

    #add white background (in case one side is cropped right already, otherwise script would fail finding contours)
    img = cv2.copyMakeBorder(img,100,100,100,100, cv2.BORDER_CONSTANT,value=[255,255,255])
    im_h, im_w = img.shape[:2]
    gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
    res_gray = cv2.resize(img,(int(im_w/6), int(im_h/6)), interpolation = cv2.INTER_CUBIC)
    found, img = cont(img, gray, thresh, crop)

    if found:
        print(f"Saveing to: {out_path}/{name}")
        try:
            if black_bg:
                img = ~img
            cv2.imwrite(f"{out_path}/{name}", img, [int(cv2.IMWRITE_JPEG_QUALITY), 100]) 
        except:
            None
        # TODO: this is always writing JPEG, no matter what was the input file type, can we detect this?

    else:
        # if no contours were found, write input file to "failed" folder
        print(f"Failed finding any contour. Saving original file to {out_path}/{name}")

        with open(filename, "rb") as in_f, open(f"{out_path}/{name}", "wb") as out_f:
            while True:
                buf = in_f.read(1024**2)
                if not buf:
                    break
                else:
                    out_f.write(buf)

def invert(img):
    return ~img


## Here comes the part I have changed:

def cropFile():

  folder_name = './cropped'

  import os
  if not os.path.exists(folder_name):
    os.makedirs(folder_name)

  params = {
    "thresh": 200,
    "crop": 15,
    "filename": 'tmp.bmp', 
    "out_path": folder_name,
    "black": True
  }

  autocrop(params)