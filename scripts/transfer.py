import argparse
import os
import re
import shutil


def set_content(source, destination):
    sections = ("reference-designs", "deployment-guides",)

    for section in sections:

        section_path = os.path.join(source, "src", section)
        if not os.path.exists(section_path):
            raise Exception("source content path does not exist")

        for diritem in os.listdir(section_path):
            source_item = os.path.abspath(os.path.join(section_path, diritem))            
            if os.path.isfile(source_item):
                content_name = re.sub(".md", "", diritem)

                # copy the content file to new location
                content_dest_dir = os.path.join(destination, "content", section, content_name)
                content_dest_file = os.path.join(content_dest_dir, "index.md")
                os.makedirs(content_dest_dir, exist_ok=True)
                shutil.copyfile(source_item, content_dest_file)

                # copy associated images to new location
                img_src_dir = os.path.join(section_path, "img", content_name)
                if not os.path.exists(img_src_dir):
                    continue

                img_dest_dir = os.path.join(content_dest_dir, "img")
                os.makedirs(img_dest_dir, exist_ok=True)
                for image_file in os.listdir(img_src_dir):
                    src_img = os.path.join(img_src_dir, image_file)
                    dest_img = os.path.join(img_dest_dir, image_file)
                    shutil.copyfile(src_img, dest_img)


def set_frontmatter(content_path):
    sections = ("reference-designs", "deployment-guides",)

    for section in sections:
        section_path = os.path.join(content_path, section)

        for item in os.listdir(section_path):
            item_path = os.path.join(section_path, item)
            item_content_path = os.path.join(item_path, "index.md")
            if os.path.isdir(item_path) and os.path.isfile(item_content_path):
                url = re.sub("/", "-", os.path.join(section, item))
                url += ".html"
                print("%s\n" % url)

            img_prefix = os.path.join("/", section)
            with open(item_content_path, "r+") as fh:
                data = fh.read()
                pattern = re.compile(r'\(\.*\/*(img.*)\)', re.MULTILINE)
                for match in pattern.finditer(data):
                    old_img_path = match.groups(0)[0]
                    new_img_path = os.path.join(section, item, "img", os.path.basename(old_img_path))
                    data = re.sub(old_img_path, new_img_path, data) 

                data = ("---\nurl: %s\n---\n" % url) + data

                fh.seek(0)
                fh.write(data)
                fh.truncate()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("source")
    parser.add_argument("destination")
    args = parser.parse_args()

    set_content(args.source, args.destination)
    set_frontmatter(args.destination)


if __name__ == '__main__':
	main()
